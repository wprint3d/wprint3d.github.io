import { Button, Icon } from "react-native-paper";

const BackButton = ({ onPress }) => (
    <Button onPress={onPress}>
        <Icon source="arrow-left" size={22} />
    </Button>
);

export default BackButton;