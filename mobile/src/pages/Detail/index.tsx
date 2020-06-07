import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { FontAwesome as Whats } from '@expo/vector-icons';
import { View, Text, Linking, StyleSheet, TouchableOpacity, Image } from 'react-native';;
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';

interface Params {
  id: number;
}

interface Data{
  point: {
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items:{
    title: string;
  }[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState<Data>({} as Data);

  const routeParams = route.params as Params;

  useEffect(() =>{
    api.get(`points/${routeParams.id}`).then( response => {      
      setData( response.data );      
    });
  },[]);

  function handleNavigationBack(){
    navigation.goBack();
  }

  function handleComposeMail(){
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],      
    });
  }
  
  function handleWhatsApp(){
    Linking.openURL(`whatsapp://send?phone=+55${data.point.whatsapp}&text=Interresse em coleta de resíduos`)
  }

  if (!data.point){
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container} >      
          <TouchableOpacity onPress={handleNavigationBack}> 
            <Icon name="arrow-left" size={20} color="#34cb79" />
          </TouchableOpacity>
          
          <Image style={styles.pointImage} source={{ uri: data.point.image_url}}  />

          <Text style={styles.pointName}>{data.point.name}</Text>
          <Text style={styles.pointItems}>
            {data.items.map(item=> item.title).join(', ')}
          </Text>
          
          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>
              {data.point.city}, {data.point.uf}</Text>
          </View>        
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsApp} >
          <Whats name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail} >
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;