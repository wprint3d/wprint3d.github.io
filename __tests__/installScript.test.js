/* eslint-env jest */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const INSTALL_SCRIPT_PATH = path.join(process.cwd(), "install");

const writeExecutable = (filePath, contents) => {
  fs.writeFileSync(filePath, contents, { mode: 0o755 });
};

const symlinkSystemCommand = (fakeBin, commandName) => {
  const resolved = spawnSync("bash", ["-lc", `command -v ${commandName}`], {
    encoding: "utf8",
  }).stdout.trim();

  if (!resolved) {
    throw new Error(`Unable to resolve required system command: ${commandName}`);
  }

  fs.symlinkSync(resolved, path.join(fakeBin, commandName));
};

const createTestDirs = () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wprint3d-install-test-"));
  const fakeBin = path.join(tempRoot, "bin");
  const homeDir = path.join(tempRoot, "home");
  const logsDir = path.join(tempRoot, "logs");

  fs.mkdirSync(fakeBin, { recursive: true });
  fs.mkdirSync(homeDir, { recursive: true });
  fs.mkdirSync(logsDir, { recursive: true });

  ["bash", "cat", "chmod", "date", "dirname", "mkdir", "mv", "readlink", "rm", "sed", "touch"].forEach((commandName) =>
    symlinkSystemCommand(fakeBin, commandName)
  );

  writeExecutable(
    path.join(fakeBin, "mktemp"),
    `#!/usr/bin/env bash
set -euo pipefail
file="$TEST_TMP_DIR/generated-\${RANDOM}"
touch "$file"
printf '%s\n' "$file"
`
  );

  return { tempRoot, fakeBin, homeDir, logsDir };
};

const writeSuccessfulCurl = (fakeBin, runnerBody) => {
  writeExecutable(
    path.join(fakeBin, "curl"),
    `#!/usr/bin/env bash
set -euo pipefail
url="\${!#}"
base_url="\${url%%\\?*}"

if [[ "$base_url" == "https://api.github.com/repos/wprint3d/wprint3d-core" ]]; then
  printf '{"default_branch":"main"}'
  exit 0
fi

if [[ "$base_url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/main/run.sh" ]]; then
  cat <<'EOF'
${runnerBody}
EOF
  exit 0
fi

if [[ "$base_url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/main/internal/migrate-podman-mongo-volume-to-docker.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
printf 'migration-helper-ready\n'
EOF
  exit 0
fi

printf 'unexpected curl url: %s\n' "$url" >&2
exit 1
`
  );
};

describe("install script", () => {
  it("fails fast when Docker is missing", () => {
    const { tempRoot, fakeBin, homeDir } = createTestDirs();

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Docker is not installed");
  });



  it("fails with a specific message when docker is a Podman wrapper", () => {
    const { tempRoot, fakeBin, homeDir } = createTestDirs();

    writeExecutable(
      path.join(fakeBin, "docker"),
      `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == "--version" ]]; then
  printf 'podman version 5.0.0\n'
  exit 0
fi
if [[ "$1" == "compose" && "$2" == "version" ]]; then
  exit 1
fi
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Podman compatibility wrapper");
  });

  it("downloads and runs the Docker runner without runtime helper files", () => {
    const { tempRoot, fakeBin, homeDir, logsDir } = createTestDirs();

    writeExecutable(
      path.join(fakeBin, "docker"),
      `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == "--version" ]]; then
  printf 'Docker version 27.0.0\n'
  exit 0
fi
if [[ "$1" == "compose" && "$2" == "version" ]]; then
  printf 'Docker Compose version v2.29.0\n'
  exit 0
fi
printf 'docker %s\n' "$*"
`
    );

    writeSuccessfulCurl(
      fakeBin,
      `#!/usr/bin/env bash
set -euo pipefail
command -v docker > "$TEST_LOG_DIR/docker-path.txt"
docker --version > "$TEST_LOG_DIR/docker-version.txt"
docker compose version > "$TEST_LOG_DIR/docker-compose-version.txt"
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(logsDir, "docker-path.txt"), "utf8").trim()).toBe(
      path.join(fakeBin, "docker")
    );
    expect(fs.readFileSync(path.join(logsDir, "docker-version.txt"), "utf8")).toContain(
      "Docker version"
    );
    expect(fs.readFileSync(path.join(logsDir, "docker-compose-version.txt"), "utf8")).toContain(
      "Docker Compose version"
    );
    expect(fs.existsSync(path.join(homeDir, ".wprint3d", "internal", "container-runtime.sh"))).toBe(false);
    expect(
      fs.existsSync(
        path.join(homeDir, ".wprint3d", "internal", "migrate-podman-mongo-volume-to-docker.sh")
      )
    ).toBe(true);
  });

  it("removes a stale Podman-backed Docker socket before checking Docker info", () => {
    const { tempRoot, fakeBin, homeDir, logsDir } = createTestDirs();
    const socketPath = path.join(tempRoot, "docker.sock");

    fs.symlinkSync("/run/podman/podman.sock", socketPath);

    writeExecutable(
      path.join(fakeBin, "sudo"),
      `#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "sudo $*" >> "$TEST_LOG_DIR/commands.log"
if [[ "$1" == "-n" && "$2" == "true" ]]; then
  exit 0
fi
exec "$@"
`
    );

    writeExecutable(
      path.join(fakeBin, "systemctl"),
      `#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "systemctl $*" >> "$TEST_LOG_DIR/commands.log"
if [[ "$1" == "cat" ]]; then
  exit 1
fi
exit 0
`
    );

    writeExecutable(
      path.join(fakeBin, "docker"),
      `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == "--version" ]]; then
  printf 'Docker version 27.0.0\n'
  exit 0
fi
if [[ "$1" == "info" ]]; then
  if [[ -e "$TEST_SOCKET_PATH" || -L "$TEST_SOCKET_PATH" ]]; then
    printf 'still pointing at stale socket\n' >&2
    exit 1
  fi

  exit 0
fi
if [[ "$1" == "compose" && "$2" == "version" ]]; then
  printf 'Docker Compose version v2.29.0\n'
  exit 0
fi
`
    );

    writeSuccessfulCurl(
      fakeBin,
      `#!/usr/bin/env bash
set -euo pipefail
printf 'runner-ok\n' > "$TEST_LOG_DIR/runner.txt"
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_SOCKET_PATH: socketPath,
        TEST_TMP_DIR: tempRoot,
        WPRINT3D_DOCKER_SOCKET_PATHS: socketPath,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Removing stale Podman-backed Docker socket symlink");
    expect(fs.lstatSync(socketPath, { throwIfNoEntry: false })).toBeUndefined();
    expect(fs.readFileSync(path.join(logsDir, "commands.log"), "utf8")).toContain(
      `sudo rm -f ${socketPath}`
    );
    expect(fs.readFileSync(path.join(logsDir, "commands.log"), "utf8")).toContain(
      "systemctl restart docker"
    );
  });

  it("runs the downloaded runner with a C locale", () => {
    const { tempRoot, fakeBin, homeDir, logsDir } = createTestDirs();

    writeExecutable(
      path.join(fakeBin, "docker"),
      `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == "--version" ]]; then
  printf 'Docker version 27.0.0\n'
  exit 0
fi
if [[ "$1" == "compose" && "$2" == "version" ]]; then
  printf 'Docker Compose version v2.29.0\n'
  exit 0
fi
`
    );

    writeSuccessfulCurl(
      fakeBin,
      `#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "\${LC_ALL:-<unset>}" > "$TEST_LOG_DIR/runner-lc-all.txt"
printf '%s\n' "\${LANG:-<unset>}" > "$TEST_LOG_DIR/runner-lang.txt"

if [[ "\${LC_ALL:-}" != 'C' ]] || [[ "\${LANG:-}" != 'C' ]]; then
  exit 1
fi
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_TMP_DIR: tempRoot,
        LANG: "es_AR.UTF-8",
        LC_ALL: "es_AR.UTF-8",
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(logsDir, "runner-lc-all.txt"), "utf8").trim()).toBe("C");
    expect(fs.readFileSync(path.join(logsDir, "runner-lang.txt"), "utf8").trim()).toBe("C");
  });
});
