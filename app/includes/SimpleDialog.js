import { Dialog, Portal, Text } from "react-native-paper";

export default function SimpleDialog({
  visible,
  setVisible = () => {},
  title,
  content,
  actions,
  left = null,
  style = { maxWidth: 800 },
  titleStyle = {},
  onDismiss = null
}) {
  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss || hideDialog}
        style={[{
          alignSelf: 'center',
          width: '90%',
          maxWidth: 800,
          maxHeight: '95%',
          overflow: 'scroll'
        }, style ]}
      >
        <Dialog.Title style={[{ textWrap: 'nowrap', textOverflow: 'ellipsis', overflow: 'visible' }, titleStyle]}>
          {left}
          <Text style={left && { marginLeft: 4 }}>
            {title}
          </Text>
        </Dialog.Title>
        <Dialog.Content>{content}</Dialog.Content>
        <Dialog.Actions>{actions}</Dialog.Actions>
      </Dialog>
    </Portal>
  );
}