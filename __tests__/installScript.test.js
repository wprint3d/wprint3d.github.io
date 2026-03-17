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

describe("install script", () => {
  it("installs Podman dependencies and exposes a Docker-compatible CLI before running the project", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wprint3d-install-test-"));
    const fakeBin = path.join(tempRoot, "bin");
    const homeDir = path.join(tempRoot, "home");
    const logsDir = path.join(tempRoot, "logs");

    fs.mkdirSync(fakeBin, { recursive: true });
    fs.mkdirSync(homeDir, { recursive: true });
    fs.mkdirSync(logsDir, { recursive: true });

    [
      "bash",
      "cat",
      "chmod",
      "dirname",
      "env",
      "grep",
      "mkdir",
      "mv",
      "sed",
      "touch",
    ].forEach((commandName) => symlinkSystemCommand(fakeBin, commandName));

    writeExecutable(
      path.join(fakeBin, "curl"),
      `#!/usr/bin/env bash
set -euo pipefail
url="\${!#}"

if [[ "$url" == "https://api.github.com/repos/wprint3d/wprint3d-core" ]]; then
  printf '{"default_branch":"main"}'
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/run.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$PATH" > "$TEST_LOG_DIR/runner-path.txt"
command -v docker > "$TEST_LOG_DIR/docker-path.txt"
docker --version > "$TEST_LOG_DIR/docker-version.txt"
docker compose version > "$TEST_LOG_DIR/docker-compose-version.txt"
EOF
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/internal/container-runtime.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
EOF
  exit 0
fi

printf 'unexpected curl url: %s\\n' "$url" >&2
exit 1
`
    );

    writeExecutable(
      path.join(fakeBin, "mktemp"),
      `#!/usr/bin/env bash
set -euo pipefail
file="$TEST_TMP_DIR/generated-\${RANDOM}"
touch "$file"
printf '%s\\n' "$file"
`
    );

    writeExecutable(
      path.join(fakeBin, "sudo"),
      `#!/usr/bin/env bash
set -euo pipefail
printf 'sudo %s\\n' "$*" >> "$TEST_LOG_DIR/install.log"
exec "$@"
`
    );

    writeExecutable(
      path.join(fakeBin, "apt-get"),
      `#!/usr/bin/env bash
set -euo pipefail
printf 'apt-get %s\\n' "$*" >> "$TEST_LOG_DIR/install.log"

if [[ "$1" == "install" ]]; then
  cat <<'EOF' > "$TEST_BIN_DIR/podman"
#!/usr/bin/env bash
if [[ "$1" == "--version" ]]; then
  printf 'podman version 5.0.0\\n'
  exit 0
fi

if [[ "$1" == "compose" && "$2" == "version" ]]; then
  printf 'podman compose version 1.0.6\\n'
  exit 0
fi

printf 'podman %s\\n' "$*"
EOF
  chmod +x "$TEST_BIN_DIR/podman"

  cat <<'EOF' > "$TEST_BIN_DIR/podman-compose"
#!/usr/bin/env bash
printf 'podman-compose %s\\n' "$*"
EOF
  chmod +x "$TEST_BIN_DIR/podman-compose"
fi
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_BIN_DIR: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);

    const installLog = fs.readFileSync(path.join(logsDir, "install.log"), "utf8");
    expect(installLog).toContain("apt-get update");
    expect(installLog).toContain("apt-get install -y podman podman-compose");

    const dockerPath = fs.readFileSync(path.join(logsDir, "docker-path.txt"), "utf8").trim();
    expect(dockerPath).toBe(path.join(homeDir, ".local/bin/docker"));

    const dockerVersion = fs.readFileSync(path.join(logsDir, "docker-version.txt"), "utf8");
    expect(dockerVersion).toContain("podman version 5.0.0");

    const dockerComposeVersion = fs.readFileSync(
      path.join(logsDir, "docker-compose-version.txt"),
      "utf8"
    );
    expect(dockerComposeVersion).toContain("podman compose version 1.0.6");

    const containersConfig = fs.readFileSync(
      path.join(homeDir, ".config/containers/containers.conf"),
      "utf8"
    );
    expect(containersConfig).toContain('compose_provider = "podman-compose"');
  });

  it("installs the compose provider when Podman already exists but compose support is missing", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wprint3d-install-test-"));
    const fakeBin = path.join(tempRoot, "bin");
    const homeDir = path.join(tempRoot, "home");
    const logsDir = path.join(tempRoot, "logs");

    fs.mkdirSync(fakeBin, { recursive: true });
    fs.mkdirSync(homeDir, { recursive: true });
    fs.mkdirSync(logsDir, { recursive: true });

    [
      "bash",
      "cat",
      "chmod",
      "dirname",
      "env",
      "grep",
      "mkdir",
      "mv",
      "sed",
      "touch",
    ].forEach((commandName) => symlinkSystemCommand(fakeBin, commandName));

    writeExecutable(
      path.join(fakeBin, "podman"),
      `#!/usr/bin/env bash
set -euo pipefail

if [[ "$1" == "--version" ]]; then
  printf 'podman version 5.0.0\\n'
  exit 0
fi

if [[ "$1" == "compose" && "$2" == "version" ]]; then
  if [[ -x "$TEST_BIN_DIR/podman-compose" ]] && grep -q 'compose_provider = "podman-compose"' "$HOME/.config/containers/containers.conf"; then
    printf 'podman compose version 1.0.6\\n'
    exit 0
  fi

  printf 'missing compose provider\\n' >&2
  exit 1
fi

printf 'podman %s\\n' "$*"
`
    );

    writeExecutable(
      path.join(fakeBin, "curl"),
      `#!/usr/bin/env bash
set -euo pipefail
url="\${!#}"

if [[ "$url" == "https://api.github.com/repos/wprint3d/wprint3d-core" ]]; then
  printf '{"default_branch":"main"}'
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/run.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
docker compose version > "$TEST_LOG_DIR/docker-compose-version.txt"
EOF
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/internal/container-runtime.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
EOF
  exit 0
fi

printf 'unexpected curl url: %s\\n' "$url" >&2
exit 1
`
    );

    writeExecutable(
      path.join(fakeBin, "mktemp"),
      `#!/usr/bin/env bash
set -euo pipefail
file="$TEST_TMP_DIR/generated-\${RANDOM}"
touch "$file"
printf '%s\\n' "$file"
`
    );

    writeExecutable(
      path.join(fakeBin, "sudo"),
      `#!/usr/bin/env bash
set -euo pipefail
printf 'sudo %s\\n' "$*" >> "$TEST_LOG_DIR/install.log"
exec "$@"
`
    );

    writeExecutable(
      path.join(fakeBin, "apt-get"),
      `#!/usr/bin/env bash
set -euo pipefail
printf 'apt-get %s\\n' "$*" >> "$TEST_LOG_DIR/install.log"

if [[ "$1" == "install" ]]; then
  cat <<'EOF' > "$TEST_BIN_DIR/podman-compose"
#!/usr/bin/env bash
printf 'podman-compose %s\\n' "$*"
EOF
  chmod +x "$TEST_BIN_DIR/podman-compose"
fi
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_BIN_DIR: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);

    const installLog = fs.readFileSync(path.join(logsDir, "install.log"), "utf8");
    expect(installLog).toContain("apt-get install -y podman-compose");

    const dockerComposeVersion = fs.readFileSync(
      path.join(logsDir, "docker-compose-version.txt"),
      "utf8"
    );
    expect(dockerComposeVersion).toContain("podman compose version 1.0.6");
  });

  it("downloads the runtime helper files required by the fetched runner", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wprint3d-install-test-"));
    const fakeBin = path.join(tempRoot, "bin");
    const homeDir = path.join(tempRoot, "home");
    const logsDir = path.join(tempRoot, "logs");

    fs.mkdirSync(fakeBin, { recursive: true });
    fs.mkdirSync(homeDir, { recursive: true });
    fs.mkdirSync(logsDir, { recursive: true });

    [
      "bash",
      "cat",
      "chmod",
      "dirname",
      "env",
      "grep",
      "mkdir",
      "mv",
      "sed",
      "touch",
    ].forEach((commandName) => symlinkSystemCommand(fakeBin, commandName));

    writeExecutable(
      path.join(fakeBin, "podman"),
      `#!/usr/bin/env bash
printf 'podman %s\\n' "$*"
`
    );

    writeExecutable(
      path.join(fakeBin, "podman-compose"),
      `#!/usr/bin/env bash
printf 'podman-compose %s\\n' "$*"
`
    );

    writeExecutable(
      path.join(fakeBin, "curl"),
      `#!/usr/bin/env bash
set -euo pipefail
url="\${!#}"

if [[ "$url" == "https://api.github.com/repos/wprint3d/wprint3d-core" ]]; then
  printf '{"default_branch":"main"}'
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/run.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_PATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
source "$SCRIPT_PATH/internal/container-runtime.sh"
init_container_runtime
printf 'runner-ready\\n' > "$TEST_LOG_DIR/runtime-helper.txt"
EOF
  exit 0
fi

if [[ "$url" == "https://raw.githubusercontent.com/wprint3d/wprint3d-core/refs/heads/main/internal/container-runtime.sh" ]]; then
  cat <<'EOF'
#!/usr/bin/env bash
init_container_runtime() {
  return 0
}
EOF
  exit 0
fi

printf 'unexpected curl url: %s\\n' "$url" >&2
exit 1
`
    );

    writeExecutable(
      path.join(fakeBin, "mktemp"),
      `#!/usr/bin/env bash
set -euo pipefail
file="$TEST_TMP_DIR/generated-\${RANDOM}"
touch "$file"
printf '%s\\n' "$file"
`
    );

    const result = spawnSync("bash", [INSTALL_SCRIPT_PATH], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOME: homeDir,
        PATH: fakeBin,
        TEST_BIN_DIR: fakeBin,
        TEST_LOG_DIR: logsDir,
        TEST_TMP_DIR: tempRoot,
      },
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(fs.readFileSync(path.join(logsDir, "runtime-helper.txt"), "utf8")).toContain("runner-ready");
    expect(
      fs.existsSync(path.join(homeDir, ".wprint3d", "internal", "container-runtime.sh"))
    ).toBe(true);
  });
});
