import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

const CompatibilityHint = ({ icon, text }) => {
    return (
        <View style={{ minWidth: 64, flexDirection: 'column', alignItems: 'center' }}>
            <Icon source={icon} size={32} />
            <Text style={{ marginTop: 8, textAlign: 'center' }}>
                {text}
            </Text>
        </View>
    );
}

export default CompatibilityHint;