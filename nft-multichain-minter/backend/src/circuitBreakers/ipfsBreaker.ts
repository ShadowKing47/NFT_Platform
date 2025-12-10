import CircuitBreaker from "opossum";

async function ipfsUpload(fn: Function, ..args:any:[]){
    return fn(..args);
}

export const ipfsBreaker = new CircuitBreaker(ipfsUpload, {
    timeout: 10000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
});