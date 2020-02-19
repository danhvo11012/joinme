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

// // Initialize Stitch client
// const app = Stitch.initializeDefaultAppClient('joinme-ufpra');

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
      client: undefined,
      currentUserId: undefined,
    };

    this.loadClient = this.loadClient.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);    
  }

  /** 
   * loadClient()
   *  Load Stitch client and check for logged in user
   * 
   * @author Danh
   * @param none
   * @returns none
   */
  loadClient = async () => {
    Stitch.initializeDefaultAppClient('joinme-ufpra').then(client => {
      this.setState({ client: client });

      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id });
        console.log('Currently loggedIn user: ' + this.state.currentUserId);
        

        this.props.navigation.navigate('App', {  
          currentUserId: this.state.currentUserId,
          user: {
            id: client.auth.user.id,
            email: client.auth.user.profile.data.email,
            isLoggedIn: client.auth.user.isLoggedIn,
            lastAuthActivity: JSON.stringify(client.auth.user.lastAuthActivity),
            loggedInProviderName: client.auth.user.loggedInProviderName,
            loggedInProviderType: client.auth.user.loggedInProviderType,
            identities: JSON.stringify(client.auth.user.identities),
          }
        });
      }
    });

  }

  /** 
   * showOrHidePass()
   *  Toggle password visibility
   * 
   * @author Khiem
   * @param none
   * @returns none
   */
  showOrHidePass = () => {
    if(this.state.showPass)
      this.setState({showPass:false});
    else
      this.setState({showPass:true});
  }
  //clear password
  clear_password = () => {
    this.setState({password:''});
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
  
  /** 
   * login()
   *  Set states: email, password and perform login operation after validating them.
   * 
   * @memberof LoginScreen
   * 
   * @author Danh
   * @param none
   * @returns none
   */
  login = async () => {
    const { email, password } = this.state;
    this.setState({ isLoading: true });

    // const credential = new UserPasswordCredential(
    //   'danhvo11012@gmail.com',  // Testing
    //   '12345678',
    // );
    // this.setState({email: 'danhvo11012@gmail.com', password: '12345678'});
   

    LayoutAnimation.easeInEaseOut();

    // Handle login with user credential
    this.setState({
      isLoading: false,
      isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
      isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
    }, () => { // setState callback
      
      if (this.state.isEmailValid && this.state.isPasswordValid) {
        const credential = new UserPasswordCredential(this.state.email, this.state.password);
        this.state.client.auth.loginWithCredential(credential)      // Returns a promise that resolves to the authenticated user
          .then(authedUser => {
  
            console.log(`Successfully logged in: ${authedUser.isLoggedIn}`);
            this.setState({ currentUserId: authedUser.id}); // Set currentUserId
            console.log(`User currently login is ${this.state.currentUserId}`);
            //clear password
            this.clear_password();
            // Navigate to App route. See navigation/AuthNavigator.js
  
            this.props.navigation.navigate('App', {
              currentUserId: this.state.currentUserId,
              user: {
                id: authedUser.id,
                email: authedUser.profile.data.email,
                isLoggedIn: authedUser.isLoggedIn,
                lastAuthActivity: JSON.stringify(authedUser.lastAuthActivity),
                loggedInProviderName: authedUser.loggedInProviderName,
                loggedInProviderType: authedUser.loggedInProviderType,
                identities: JSON.stringify(authedUser.identities),
              }
            });  
          })
          .catch(err => { 
            alert(`Looks like there's no user account associated with your login. Please signup for your account.`);
            this.selectCategory(1);
            console.error(`Login failed with error: ${err}`);
          });
      }

    });
  }    

  /** 
   * signUp()
   *  Signup new email account 
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
    }, () => { // setState callback()
      if (this.state.isEmailValid && this.state.isPasswordValid && this.state.isConfirmationValid) {
      // Initialize stitch's emailPasswordClient
      const emailPasswordClient = this.state.client.auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

      // Register email
      emailPasswordClient.registerWithEmail(email, password)
        .then(() => {
          alert("Successfully created new account with email: " + email);
          this.selectCategory(0); // Focus on signUp
        })
        .catch(err => {
          alert("Looks like your email: " + email + " already in use. Please try again.")
          // console.log("Error registering new user:", err)
        });
      }
    });
  }

  componentDidMount() {
    this.loadClient();
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
      currentUserId,
      client,
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
                    <TouchableOpacity onPress={this.showOrHidePass.bind(this)}>
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
                />
                
              </View>
            </KeyboardAvoidingView>
            <View style={styles.helpContainer}>
              <Button
                title={'Need help ?'}
                titleStyle={{ color: 'white' }}
                buttonStyle={{ backgroundColor: 'transparent' }}
                underlayColor="transparent"
                onPress={() => alert('I\'m busy. Go help yourself.')}
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
    fontSize: 30,
    fontFamily: 'regular',
  },
  helpContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
