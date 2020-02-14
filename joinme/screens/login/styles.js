import { Dimensions } from "react-native";
import Colors from "./../../constants/Colors"
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = {

    container: {
      flex: 1,
      
    },
    rowSelector: {
      height: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectorContainer: {
      flex: 1,
      alignItems: 'center',
    },
    selected: {
      position: 'absolute',
      borderRadius: 50,
      height: 0,
      width: 0,
      top: -5,
      borderRightWidth: 70,
      borderBottomWidth: 70,
      borderColor: 'white',
      backgroundColor: 'white',
    },
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginTextButton: {
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: Colors.primary,
      borderRadius: 10,
      height: 50,
      width: 200,
    },
    titleContainer: {
      height: 150,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    formContainer: {
      backgroundColor: 'white',
      width: SCREEN_WIDTH - 30,
      borderRadius: 10,
      paddingTop: 32,
      paddingBottom: 32,
      alignItems: 'center',
    },
    loginText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    bgImage: {
      flex: 1,
      top: 0,
      left: 0,
      resizeMode: 'cover',
      width: null,
      height: null,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 24,
      fontFamily: 'regular',
      backgroundColor: 'transparent',
      opacity: 0.7,
    },
    selectedCategoryText: {
      opacity: 1.2,
    },
    titleText: {
      color: 'white',
      fontSize: 30,
      fontFamily: 'regular',
    },
    helpContainer: {
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
  

export default styles;