import React from 'react';
import { View,Text,StyleSheet,Pressable,ScrollView } from 'react-native';
import { router } from 'expo-router';
import { COLORS,RADIUS } from '../constants/theme';
export default function Parent(){
 return <ScrollView style={s.page} contentContainerStyle={s.content}>
  <Text style={s.eyebrow}>PARENT MODE</Text><Text style={s.h1}>Welcome back! 👋</Text>
  <Text style={s.sub}>Help your little one learn, play and grow.</Text>
  <View style={s.codeBox}><Text style={s.label}>YOUR FAMILY CODE</Text><Text style={s.code}>583 214</Text><Text style={s.small}>Share this code with your child</Text></View>
  <Text style={s.section}>Your children</Text>
  <View style={s.childRow}><Text style={s.avatar}>🧒</Text><View style={{flex:1}}><Text style={s.name}>Amina</Text><Text style={s.small}>Level 7 • 72% this week</Text></View><Text style={s.badge}>72%</Text></View>
  <View style={s.childRow}><Text style={s.avatar}>👦</Text><View style={{flex:1}}><Text style={s.name}>Yusuf</Text><Text style={s.small}>Level 4 • 54% this week</Text></View><Text style={s.badge}>54%</Text></View>
  <Pressable style={s.primary} onPress={()=>router.push('/premium')}><Text style={s.primaryText}>⭐ Manage Premium Family</Text></Pressable>
  <Text style={s.section}>Parent tools</Text>
  {['📊 Learning progress','👨‍👩‍👧 Manage children','🔐 Parent PIN & safety','⚙️ Settings'].map(x=><View style={s.tool} key={x}><Text style={s.toolText}>{x}</Text><Text>›</Text></View>)}
 </ScrollView>
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:COLORS.cream},content:{padding:24,paddingTop:60},eyebrow:{fontSize:12,fontWeight:'900',letterSpacing:2,color:COLORS.sky},h1:{fontSize:32,fontWeight:'900',color:COLORS.navy,marginTop:7},sub:{color:COLORS.muted,marginTop:5},codeBox:{marginTop:24,backgroundColor:COLORS.navy,borderRadius:RADIUS.xl,padding:24,alignItems:'center'},label:{color:'#A9C9E5',fontSize:11,fontWeight:'900',letterSpacing:2},code:{color:COLORS.gold,fontSize:38,fontWeight:'900',letterSpacing:5,marginVertical:10},small:{color:COLORS.muted,fontSize:13},codeBox:{},section:{fontSize:21,fontWeight:'900',color:COLORS.navy,marginTop:28,marginBottom:12},childRow:{backgroundColor:COLORS.white,borderRadius:RADIUS.lg,padding:16,flexDirection:'row',alignItems:'center',marginBottom:10},avatar:{fontSize:36,marginRight:13},name:{fontSize:17,fontWeight:'900',color:COLORS.navy},badge:{backgroundColor:'#E6F7ED',color:'#2C9A5A',fontWeight:'900',padding:8,borderRadius:12},primary:{backgroundColor:COLORS.gold,borderRadius:18,padding:17,alignItems:'center',marginTop:8},primaryText:{fontWeight:'900',color:COLORS.navy,fontSize:15},tool:{backgroundColor:COLORS.white,padding:17,borderRadius:16,flexDirection:'row',justifyContent:'space-between',marginBottom:8},toolText:{fontWeight:'800',color:COLORS.text}});