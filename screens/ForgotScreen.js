import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableHighlight } from 'react-native-web';
import useStyles from './styles/greetingsScreen.module';
import DataInput from '../components/inputs/textInput/textInput';
import HeaderButton from '../components/buttons/headerButton';

function ForgotScreen({ navigation }) {
  const styles = useStyles();
  const [inputText, setInputText] = useState({
    newPassword: '',
    email: '',
    confirmPassword: '',
    code: ''
  });

  
  const username = 'admin';
  const password = 'root';
  const [receivedCode, setReceivedCode] = useState('');
 
  const isButtonDisabled = () => {
    return (
      !inputText.newPassword ||
      !inputText.email ||
      !inputText.confirmPassword ||
      !inputText.code ||
      inputText.newPassword !== inputText.confirmPassword || inputText.code != receivedCode
    );
  };

  const isDisabled = () => {
    return !inputText.email;
  };

  const getCode = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inputText.email)) {
      alert('Не верный формат почты');
      return;
    }
    const email = encodeURIComponent(inputText.email);
    const apiUrl = `https://messengerproject-production.up.railway.app/api/send_email?email=${email}`;

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReceivedCode(data);
        if (data) {
          alert('Код подтверждения был отправлен на указанную почту!');
        } else {
          alert('Не удалось отправить код подтверждения');
         
        }
      })
      .catch((error) => {
        alert('Ошибка при подключении к серверу:', error);
      });
  };
  
  const getUserById = async (email) => {
    try {
      const response = await fetch(`https://messengerproject-production.up.railway.app/api/users/email?email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
      return userData;
      } else {
        alert('Пользователь с указанной почтой не найден');
      }
    } catch (error) {
      alert('Ошибка при подключении к серверу:', error);
    }
  };
  
  const updatePassword = async (userId) => {
    try {
      const queryParams = new URLSearchParams({
        new_password: inputText.newPassword,
      });
      const response = await fetch(`https://messengerproject-production.up.railway.app/api/users/${userId}/update/password?${queryParams.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({
          new_password: inputText.newPassword,
        }),
      });
      if (response.ok) {
        alert('Пароль успешно обновлен');
      } else {
        response.json().then(errorData => {
          const errorMessage = errorData.message ;
         alert(errorMessage);
        });
      }
    } catch (error) {
      alert('Ошибка при подключении к серверу:', error);
    }
  };
  
  const handleResetPassword = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(inputText.newPassword)) {
      alert('Неправильный формат пароля: минимум 8 символов в длину, должен содержать минимум одну заглавную и строчную букву, минимум одну цифру, также может содержать специальный символы( !@#$%^&*)');
      return;
    }
    try {
      const userId = await getUserById(inputText.email);
    if (userId) {
      await updatePassword(userId);
      alert('Пароль успешно обновлен');
    } else {
      alert('Пользователь с указанной почтой не найден');
    }
      navigation.navigate('Auth');
    } catch (error) {
      alert('Ошибка при подключении к серверу:', error);
    }
  };
  

  return (
    <View style={styles.containerMain}>
      <View style={styles.textContainer}>
        <View style={styles.inputContainer}>
          <View style={{ marginBottom: 13 }}>
            <DataInput
              value={inputText.email}
              setValue={(text) => setInputText({ ...inputText, email: text })}
              placeholder={'Почта'}
              type={'email'}
              flex={false}
            />
          </View>
          <View style={{ marginBottom: 13 }}>
            <DataInput
              value={inputText.newPassword}
              setValue={(text) => setInputText({ ...inputText, newPassword: text })}
              placeholder={'Новый пароль'}
              type={'password'}
              flex={false}
            />
          </View>
          <View style={{ marginBottom: 13 }}>
            <DataInput
              value={inputText.confirmPassword}
              setValue={(text) => setInputText({ ...inputText, confirmPassword: text })}
              placeholder={'Подтвердить пароль'}
              type={'password'}
              flex={false}
            />
          </View>
          <View style={{ marginBottom: 13 }}>
            <DataInput
              value={inputText.code}
              setValue={(text) => setInputText({ ...inputText, code: text })}
              placeholder={'Код'}
              type={'code'}
              flex={false}
            />
          </View>
        </View>

        <View>
          <HeaderButton title={'Изменить пароль'} onPress={handleResetPassword} disabled={isButtonDisabled()} />
        </View>
        <View style={{ marginBottom: 13 }}>
          <HeaderButton title={'Получить код'} onPress={getCode} disabled={isDisabled()} />
        </View>
      </View>
    </View>
  );
}

export default ForgotScreen;
