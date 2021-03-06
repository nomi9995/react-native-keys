module.exports.makeCppFileTemplateAndroid = (data) => {
  return `
  #include "crypto.hpp"
  #include <string>
  #include "encrypt.h"

  using namespace std;

  Crypto::Crypto() {

  }


  std::string Crypto::getJniJsonStringyfyData(string key) {
    std::string jsonStringyfyData= "${data}";
      string hash;
      int len=jsonStringyfyData.length();
      char cahrtot[len+1];
      strcpy(cahrtot,jsonStringyfyData.c_str());
      hash=SHA256(cahrtot);
      string halfString=hash.substr(hash.length()/2);
      if(key==halfString)
      {
        return jsonStringyfyData;
      }
      else
      {
          return "";
      }
    
  }
  `;
};

module.exports.makeHppFileTemplateAndroid = () => {
  return `
  #ifndef crypto_hpp
  #define crypto_hpp

  #include <stdio.h>
  #include <string>
  using namespace std;

  class Crypto {
  public:Crypto();
    string getJniJsonStringyfyData(string key);
  };
  #endif
  `;
};

module.exports.makeCryptographicModuleTemplateAndroid = (key) => {
  return `
  package com.rnkeys;
  import android.content.Context;
  import android.content.res.Resources;
  import android.util.Log;
  
  import androidx.annotation.NonNull;
  
  import com.facebook.react.bridge.Promise;
  import com.facebook.react.bridge.ReactApplicationContext;
  import com.facebook.react.bridge.ReactContextBaseJavaModule;
  import com.facebook.react.bridge.ReactMethod;
  
  import org.json.JSONException;
  import org.json.JSONObject;

  import java.lang.reflect.Field;
  import java.util.HashMap;
  import java.util.Map;
  
  public class KeysModule extends ReactContextBaseJavaModule {
      public static final String REACT_CLASS = "Keys";
      public static final String PRIVATE_KEY = "${key}";
      private static ReactApplicationContext reactContext;
  
      static private JSONObject jniData;
  
      KeysModule(ReactApplicationContext context) {
          super(context);
          reactContext = context;
      }
  
  
      @ReactMethod
      static public void secureFor(String key,Promise promise) {
          String value=getSecureFor(key);
          promise.resolve(value);
      }
  
  
      static public String getSecureFor(String key) {
  
          try {
              if (jniData == null)
                  jniData = new JSONObject(CLibController.getInstance().getJniJsonStringyfyData(PRIVATE_KEY));
  
              if (jniData.has(key)) {
                  return jniData.getString(key);
              }
          } catch (Exception ignore) {
              return "";
          }
          return "";
      }
  
      @ReactMethod
      public void sampleMethod(Promise promise) {
         promise.resolve("I am sample Methods");
      }
  
      @Override
      public String getName() {
          return REACT_CLASS;
      }

      @Override
      public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
  
        try {
          Context context = getReactApplicationContext();
          int resId = context.getResources().getIdentifier("build_config_package", "string", context.getPackageName());
          String className;
          try {
            className = context.getString(resId);
          } catch (Resources.NotFoundException e) {
            className = getReactApplicationContext().getApplicationContext().getPackageName();
          }
          Class clazz = Class.forName(className + ".BuildConfig");
          Field[] fields = clazz.getDeclaredFields();
          for(Field f: fields) {
            try {
              constants.put(f.getName(), f.get(null));
            }
            catch (IllegalAccessException e) {
              Log.d("ReactNative", "ReactConfig: Could not access BuildConfig field " + f.getName());
            }
          }
        }
        catch (ClassNotFoundException e) {
          Log.d("ReactNative", "ReactConfig: Could not find BuildConfig class");
        }
  
        return constants;
      }
    }  
  `;
};
