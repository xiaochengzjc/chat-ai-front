import {STORAGE_KEYS} from '@/common/constant.js'

export function setToken(token){
    return uni.setStorageSync(STORAGE_KEYS.TOKEN,token);
};

export function getToken(){
    return uni.getStorageSync(STORAGE_KEYS.TOKEN);
};
export function removeToken(){
    return uni.removeStorageSync(STORAGE_KEYS.TOKEN);
}