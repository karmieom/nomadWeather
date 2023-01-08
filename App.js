import React , { useState, useEffect  } from 'react';
import { ActivityIndicator, View,Text, StyleSheet, ScrollView , Dimensions} from 'react-native';
import * as Location from 'expo-location';

const {  width: SCREEN_WIDTH} = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState(null);
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true); 
  const API_KEY = "726fa9040e4ece840b9d20005ca03eae";

  const getWeather = async () => { 
      
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setOk(false); 
    }

    const {coords: {latitude,longitude} } = await Location.getCurrentPositionAsync({accuracy: 8});
    const location = await Location.reverseGeocodeAsync({latitude,longitude} ,{ useGoogleMaps: false} );

    setCity(location[0].city ); 


    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`);
        let json = await response.json();
        // setDays(json.list);
         
        json.list.map((oneUnit) => {
          // const editedOneUnit = {dt: `${oneUnit.dt_txt.substr(5,5)} ${oneUnit.dt_txt.substr(10,2)} H`,
          const editedOneUnit = {dt: oneUnit.dt_txt.substr(5 , 11) ,
                                main: oneUnit.weather[0].main,
                                description: oneUnit.weather[0].description,
            temp: parseFloat(oneUnit.main.temp).toFixed(1)} ;
          setDays((prev) => [...prev, editedOneUnit] );
         })


      } catch (error) {
         console.error("error", error);
      } 
  
  }
  useEffect(() => {getWeather()}, []);

  return (
    <View style={styles.container} > 
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
       </View>
      <ScrollView pagingEnabled 
                  horizontal 
                  showsHorizontalScrollIndicator={false}  
                  contentContainerStyle={styles.weather}>
        { days.length ===0? (
            <View style={styles.day}>
              <ActivityIndicator size="large" color="#white" style={styles.indicator}/>
            </View>
          ) :
          (
            days.map( (day, index)  => (
                  <View style={styles.day} key={index}>
                    <Text style={styles.dt}>{day.dt}</Text>
                    <Text style={styles.temp}>{day.temp}&#176;F</Text>
                    <Text style={styles.main}>{day.main} frshman</Text>
                    <Text style={styles.description}>{day.description}</Text>
                  </View>
                ))

            
          )}
 
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {flex:1 , backgroundColor:"tomato"},
    city: {
        flex: 1.5,
        justifyContent: "center",
        alignItems: "center"
    },
    cityName: {
      fontSize: 60, 
      fontWeight: "500",
    },
    weather: {
      // backgroundColor: "blue",
    },
    day: {
       alignItems: "center",
      width: SCREEN_WIDTH,
    },
    dt: {
      marginTop: 50,
      // fontWeight: "600",
      fontSize: 40, 
    },
    indicator: {
      marginTop:30
    },
    temp: {
      fontWeight: "600",
      fontSize: 80, 
    },
    main: {
      marginTop: -30,
      fontSize: 60, 
    },
    description: {
      marginTop: -10,
      fontSize: 30, 
    },

}

)
