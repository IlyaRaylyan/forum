import firebase from "firebase";
import { helpers as vuelidateHelpers } from "vuelidate/lib/validators";

export const uniqueUsername = value => {
  if (!vuelidateHelpers.req(value)) {
    return true;
  }
  return new Promise(resolve => {
    firebase
      .database()
      .ref("users")
      .orderByChild("usernameLower")
      .equalTo(value.toLowerCase())
      .once("value", snapshot => resolve(!snapshot.exists()));
  });
};

export const uniqueEmail = value => {
  if (!vuelidateHelpers.req(value)) {
    return true;
  }
  return new Promise(resolve => {
    firebase
      .database()
      .ref("users")
      .orderByChild("email")
      .equalTo(value.toLowerCase())
      .once("value", snapshot => resolve(!snapshot.exists()));
  });
};

export const supportedImageFile = value => {
  if (!vuelidateHelpers.req(value)) {
    return true;
  }
  const supported = ["jpg", "jpeg", "png", "gif", "svj"];
  const suffix = value.split(".").pop();
  return supported.includes(suffix);
};
