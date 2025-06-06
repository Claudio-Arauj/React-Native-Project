import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import React from "react";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#2E7D32";      // Verde escuro (navbar background)
const SECONDARY_COLOR = "#F0F0F0";    // Branco acinzentado (ícones não ativos)
const ACTIVE_BG_COLOR = "#FFFFFF";   // Bolha clara para item ativo
const ACTIVE_TEXT_COLOR = "#2E7D32"; // Texto verde escuro dentro da bolha branca


const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
            styles.tabItem,
            {
                backgroundColor: isFocused ? ACTIVE_BG_COLOR : "transparent"
            },
            ]}
          >
            {getIconByRouteName(
            route.name,
            isFocused ? ACTIVE_TEXT_COLOR : SECONDARY_COLOR
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
        case "Home":
        return <Feather name="home" size={18} color={color} />;
        case "Hábitos":
        return <AntDesign name="checkcircleo" size={18} color={color} />;
        case "Sono":
        return <Feather name="moon" size={18} color={color} />;
        case "Diário":
        return <Feather name="book-open" size={18} color={color} />;
        case "Perfil":
        return <FontAwesome6 name="circle-user" size={18} color={color} />;
        default:
        return <Feather name="help-circle" size={18} color={color} />;
    }
    }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    width: "85%",
    alignSelf: "center",
    bottom: 20,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
  text: {
    color: ACTIVE_TEXT_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default CustomNavBar;
