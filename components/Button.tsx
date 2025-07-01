import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "@/constants/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = { ...styles.button };
    
    // Variant styles
    switch (variant) {
      case "primary":
        buttonStyle = { ...buttonStyle, ...styles.primaryButton };
        break;
      case "secondary":
        buttonStyle = { ...buttonStyle, ...styles.secondaryButton };
        break;
      case "outline":
        buttonStyle = { ...buttonStyle, ...styles.outlineButton };
        break;
      case "danger":
        buttonStyle = { ...buttonStyle, ...styles.dangerButton };
        break;
    }
    
    // Size styles
    switch (size) {
      case "small":
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case "medium":
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case "large":
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleObj: TextStyle = { ...styles.buttonText };
    
    // Variant text styles
    switch (variant) {
      case "primary":
        textStyleObj = { ...textStyleObj, ...styles.primaryText };
        break;
      case "secondary":
        textStyleObj = { ...textStyleObj, ...styles.secondaryText };
        break;
      case "outline":
        textStyleObj = { ...textStyleObj, ...styles.outlineText };
        break;
      case "danger":
        textStyleObj = { ...textStyleObj, ...styles.dangerText };
        break;
    }
    
    // Size text styles
    switch (size) {
      case "small":
        textStyleObj = { ...textStyleObj, ...styles.smallText };
        break;
      case "medium":
        textStyleObj = { ...textStyleObj, ...styles.mediumText };
        break;
      case "large":
        textStyleObj = { ...textStyleObj, ...styles.largeText };
        break;
    }
    
    // Disabled text style
    if (disabled) {
      textStyleObj = { ...textStyleObj, ...styles.disabledText };
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "outline" ? colors.primary : "#FFFFFF"} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: colors.inactive,
    borderColor: colors.inactive,
  },
  buttonText: {
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: "#FFFFFF",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: "#FFFFFF",
  },
  textWithIcon: {
    marginLeft: 8,
  },
});