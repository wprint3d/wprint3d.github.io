import { useState } from "react";
import { List } from "react-native-paper";

const ClickableStep = ({ title, descriptionNumberOfLines = 4, description, left, right, onPress = () => {}, ...props }) => {
    const [ isDone, setIsDone ] = useState(false);

    return (
        <List.Item
            title={title}
            titleStyle={{ fontWeight: 'bold' }}
            descriptionNumberOfLines={descriptionNumberOfLines}
            description={description}
            onPress={
                isDone
                    ? null
                    : () => {
                        onPress();

                        setIsDone(true);
                    }
            }
            left={left}
            right={
                isDone
                    ? props => <List.Icon {...props} icon='check' color="green" />
                    : right
            }
            {...props}
        />
    );
}

export default ClickableStep;