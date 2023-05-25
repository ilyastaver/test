import { StyleSheet, useWindowDimensions } from "react-native-web";

export default function useStyles() {
    const { width, height } = useWindowDimensions();
    return StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-end',
        },
        input: {
          flex: 1,
          height: 44,
          fontSize: 16,
          paddingLeft: 40,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          color: '#000000',
          boxShadow: '2px 2px 2px rgba(0, 0, 0, 1)',
          fontFamily: 'Montserrat-Regular',
          alignSelf: 'flex-start',
          marginRight: 30
        },
        sendButton: {
          alignSelf: 'flex-end',
          marginLeft: 30,
          width: 60,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
}