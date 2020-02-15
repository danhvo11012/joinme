// @ts-nocheck
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

// import AppContainer from '../navigation';
import BottomTabNavigator from '../navigation/BottomTabNavigator';

// Import Stitch features
import { Stitch, UserPasswordCredential, UserPasswordAuthProviderClient } from 'mongodb-stitch-react-native-sdk';

const BG_IMAGE = require('../assets/images/bg_screen4.jpg');

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={selected && styles.selected} />
    </View>
  );
};

TabSelector.propTypes = {
  selected: PropTypes.bool.isRequired,
};

// Initialize Stitch client
const app = Stitch.initializeDefaultAppClient('joinme-ufpra');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      selectedCategory: 0,
      isLoading: false,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
      showPass: false,
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  /** ShowOrHidePass
   * Toggle password visibility
   * 
   * @author Khiem
   * @param none
   * @return none
   */
  ShowOrHidePass =() => {
    if(this.state.showPass)
      this.setState({showPass:false});
    else
      this.setState({showPass:true});
  }

  selectCategory(selectedCategory) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      selectedCategory,
      isLoading: false,
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  /** login()
   *  Set states: email, password and perform login operation after validating them.
   * @memberof LoginScreen
   * 
   * @author Danh
   * @param none
   * @return none
   */
  login = async () => {
    const { email, password } = this.state;
    this.setState({ isLoading: true });

    // const credential = new UserPasswordCredential(
    //   'danhvo11012@gmail.com',  // Testing
    //   '12345678',
    // );
    const credential = new UserPasswordCredential(this.state.email, this.state.password);

    LayoutAnimation.easeInEaseOut();

    // Handle login with user credential
    app.then(client => {

      this.setState({
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
      });

      if (this.state.isEmailValid && this.state.isPasswordValid) {
        client.auth.loginWithCredential(credential)
        // Returns a promise that resolves to the authenticated user
        .then(authedUser => {
          alert(`Successfully logged in: ${authedUser.isLoggedIn}`);
          
          this.props.navigation.navigate('App');  // Navigate to App route. See navigation/AuthNavigator.js
        })
        .catch(err => { 
          // console.error(`login failed with error: ${err}`);
          alert(`Looks like there's no user account associated with your login. Please signup for your account.`);
          this.selectCategory(1);
        });
      }
    });
  }    

  /** signUp()
   * Signup new email account 
   *
   * @memberof LoginScreen
   * 
   * @author Danh
   * @param none
   * @return none
   */
  signUp = async () => {
    const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true });
    
    LayoutAnimation.easeInEaseOut();

    // Email + password validation 
    this.setState({
      isLoading: false,
      isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
      isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
      isConfirmationValid:
        password === passwordConfirmation || this.confirmationInput.shake(),
    });

    // Initialize stitch's emailPasswordClient
    const emailPasswordClient = Stitch.defaultAppClient.auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    // Register email
    emailPasswordClient.registerWithEmail(email, password)
      .then(() => {
        alert("Successfully created new account with email: " + email);
        this.selectCategory(0); // Focus on signIn
      })
      .catch(err => {
        alert("Looks like your email: " + email + " already in use. Please try again.")
        console.log("Error registering new user:", err)
      });
  }

  render() {
    const {
      selectedCategory,
      isLoading,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;

    return (
      <View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          <View>
            <KeyboardAvoidingView
              contentContainerStyle={styles.loginContainer}
              behavior="position"
            >
              <View style={styles.titleContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.titleText}>CONNECT WITH US</Text>
                </View>
                
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Button
                  disabled={isLoading}
                  type="clear"
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(0)}
                  containerStyle={{ flex: 1 }}
                  titleStyle={[
                    styles.categoryText,
                    isLoginPage && styles.selectedCategoryText,
                  ]}
                  title={'Login'}
                />
                <Button
                  disabled={isLoading}
                  type="clear"
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(1)}
                  containerStyle={{ flex: 1 }}
                  titleStyle={[
                    styles.categoryText,
                    isSignUpPage && styles.selectedCategoryText,
                  ]}
                  title={'Sign up'}
                />
              </View>
              <View style={styles.rowSelector}>
                <TabSelector selected={isLoginPage} />
                <TabSelector selected={isSignUpPage} />
              </View>
              <View style={styles.formContainer}>
                <Input
                  leftIcon={
                    <Icon
                      name="envelope-o"
                      type="font-awesome"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  value={email}
                  keyboardAppearance="light"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  inputStyle={{ marginLeft: 10 }}
                  placeholder={'Email'}
                  containerStyle={{
                    borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                  }}
                  ref={input => (this.emailInput = input)}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  onChangeText={email => this.setState({ email })}
                  errorMessage={
                    isEmailValid ? null : 'Please enter a valid email address'
                  }
                />
                <Input
                  leftIcon={
                    <Icon
                      name="key"
                      type="simple-line-icon"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  rightIcon={
                    <TouchableOpacity onPress={this.ShowOrHidePass.bind(this)}>
                      <Icon
                        name={this.state.showPass ? "lock-open" :"lock"}
                        type="simple-line-icon"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    </TouchableOpacity>
                  }
                  value={password}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!this.state.showPass}
                  returnKeyType={isSignUpPage ? 'next' : 'done'}
                  blurOnSubmit={true}
                  containerStyle={{
                    marginTop: 16,
                    borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                  }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder={'Password'}
                  ref={input => (this.passwordInput = input)}
                  // Disabled onSubmitEditing. Only submit by pressing button
                  // onSubmitEditing={() => isSignUpPage ? this.confirmationInput.focus() : this.login() } 
                  onChangeText={password => this.setState({ password })}
                  errorMessage={
                    isPasswordValid
                      ? null
                      : 'Please enter at least 8 characters'
                  }
                />
                {isSignUpPage && (
                  <Input
                   leftIcon={
                      <Icon
                        name="key"
                        type="simple-line-icon"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    
                    value={passwordConfirmation}
                    secureTextEntry={!this.state.showPass}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType={'done'}
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                    }}
                    inputStyle={{ marginLeft: 10 }}
                    placeholder={'Confirm password'}
                    ref={input => (this.confirmationInput = input)}
                    // Disabled onSubmitEditing. Only submit by pressing button
                    // onSubmitEditing={this.signUp}
                    onChangeText={passwordConfirmation =>
                      this.setState({ passwordConfirmation })
                    }
                    errorMessage={
                      isConfirmationValid
                        ? null
                        : 'Please enter the same password'
                    }
                  />
                )}
                
                <Button
                  buttonStyle={styles.loginButton}
                  containerStyle={{ marginTop: 32, flex: 0 }}
                  activeOpacity={0.8}
                  title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                  onPress={isLoginPage ? this.login : this.signUp}
                  titleStyle={styles.loginTextButton}
                  loading={isLoading}
                  disabled={isLoading}
                  // linearGradientProps={{
                  //   colors: ['rgba(232,117,0,1)', 'rgba(201,81,0,1)'],
                  //   start: [0, 0],
                  //   end: [1, 0],
                  // }}
                  // ViewComponent={LinearGradient}
                />
              
              </View>
            </KeyboardAvoidingView>
            <View style={styles.helpContainer}>
              <Button
                title={'Need help ?'}
                titleStyle={{ color: 'white' }}
                buttonStyle={{ backgroundColor: 'transparent' }}
                underlayColor="transparent"
                onPress={() => console.log('Account created')}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

import { Dimensions } from "react-native";
import Colors from "../constants/Colors"
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontFamily: 'light',
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'regular',
  },
  helpContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
