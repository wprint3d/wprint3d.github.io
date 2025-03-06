import { View } from "react-native";

const TabWrapper = ({ children, isSmallScreen = false }) => (
    <View style={[
        { paddingBottom: 0 },
        isSmallScreen
            ? { paddingVertical: 16, paddingHorizontal: 0 }
            : { padding: 16 }
    ]}>
        {children}
    </View>
);

export default TabWrapper;