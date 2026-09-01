import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { COLORS, RADIUS } from '../constants/theme';
import Star from '../components/Star';

export default function Welcome(){
 return <ScrollView contentContainerStyle={s.container}>
   <View style={s.sky}>
     <View style={s.moon}><Text style={s.moonText}>☾</Text></View>
     <Star size={24}/><View style={s.star2}><Star size={18}/></View>
     <Text style={s.brand}>Muslim Kids World</Text>
     <Text style={s.tagline}>LEARN • PLAY • GROW</Text>
   </View>
   <View style={s.content}>
     <Text style={s.question}>Who are you?</Text>
     <Text style={s.sub}>Choose your experience to get started.</Text>
     <Pressable style={[s.card,s.parent]} onPress={()=>router.push('/parent')}>
       <Text style={s.icon}>👨‍👩‍👧</Text><View style={{flex:1}}>
       <Text style={s.title}>I'm a Parent</Text><Text style={s.desc}>Manage your child's learning</Text></View><Text style={s.arrow}>›</Text>
     </Pressable>
     <Pressable style={[s.card,s.child]} onPress={()=>router.push('/child-code')}>
       <Text style={s.icon}>🧒</Text><View style={{flex:1}}>
       <Text style={s.title}>I'm a Child</Text><Text style={s.desc}>Learn, play & discover</Text></View><Text style={s.arrow}>›</Text>
     </Pressable>
     <View style={s.trust}><Text>🛡️ Safe content</Text><Text>🔒 Parent control</Text><Text>💛 Made for families</Text></View>
   </View>
 </ScrollView>
}
const s=StyleSheet.create({
 container:{flexGrow:1,backgroundColor:COLORS.cream},
 sky:{height:330,backgroundColor:COLORS.sky,borderBottomLeftRadius:42,borderBottomRightRadius:42,paddingTop:65,paddingHorizontal:28,alignItems:'center',overflow:'hidden'},
 moon:{position:'absolute',right:34,top:45,width:90,height:90,borderRadius:45,backgroundColor:'#8DD9F9',alignItems:'center',justifyContent:'center'},
 moonText:{fontSize:70,color:COLORS.cream,marginLeft:-8,marginTop:-5},
 star2:{position:'absolute',left:38,top:82},
 brand:{marginTop:78,fontSize:31,fontWeight:'900',color:COLORS.white,textAlign:'center'},
 tagline:{marginTop:8,fontSize:13,fontWeight:'800',letterSpacing:2,color:COLORS.cream},
 content:{padding:24},
 question:{fontSize:30,fontWeight:'900',color:COLORS.navy,textAlign:'center'},
 sub:{fontSize:15,color:COLORS.muted,textAlign:'center',marginTop:7,marginBottom:22},
 card:{minHeight:104,borderRadius:RADIUS.lg,padding:18,flexDirection:'row',alignItems:'center',marginBottom:14,borderWidth:1,borderColor:COLORS.border},
 parent:{backgroundColor:'#E9F7FF'}, child:{backgroundColor:'#FFF4C9'},
 icon:{fontSize:38,marginRight:15},title:{fontSize:20,fontWeight:'900',color:COLORS.navy},desc:{fontSize:13,color:COLORS.muted,marginTop:4},arrow:{fontSize:34,color:COLORS.navy},
 trust:{flexDirection:'row',justifyContent:'space-between',marginTop:14,flexWrap:'wrap',gap:10}, 
});