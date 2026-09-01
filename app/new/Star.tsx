import { Text } from 'react-native';
export default function Star({size=22, color='#FFC94A'}:{size?:number,color?:string}) {
  return <Text style={{fontSize:size,color}}>★</Text>;
}