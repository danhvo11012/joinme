import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import styles from './styles';


const BG_IMAGE = require('../../assets/images/bg_screen4.jpg');

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
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
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

  login() {
    const { email, password } = this.state;
    this.setState({ isLoading: true });
    // Simulate an API call
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
      });
    }, 1500);
  }

  signUp() {
    const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true });
    // Simulate an API call
    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
        isConfirmationValid:
          password === passwordConfirmation || this.confirmationInput.shake(),
      });
    }, 1500);
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
                  <Text style={styles.titleText}>JOIN ME</Text>
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
                      name="lock"
                      type="simple-line-icon"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  value={password}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType={isSignUpPage ? 'next' : 'done'}
                  blurOnSubmit={true}
                  containerStyle={{
                    marginTop: 16,
                    borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                  }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder={'Password'}
                  ref={input => (this.passwordInput = input)}
                  onSubmitEditing={() =>
                    isSignUpPage ? this.confirmationInput.focus() : this.login()
                  }
                  onChangeText={password => this.setState({ password })}
                  errorMessage={
                    isPasswordValid
                      ? null
                      : 'Please enter at least 8 characters'
                  }
                />
                {isSignUpPage && (
                  <Input
                    icon={
                      <Icon
                        name="lock"
                        type="simple-line-icon"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    value={passwordConfirmation}
                    secureTextEntry={true}
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
                    onSubmitEditing={this.signUp}
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
                onPress={() => console.log('Account created')}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

