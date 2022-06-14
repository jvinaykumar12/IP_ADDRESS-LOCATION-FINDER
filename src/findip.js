export default function findip(props,type){

    let coArray = []
    let allpromises = []
    let tempstring = new Array(45)
    let count = 0;
    console.log(props)
    const simplifyTorrenip = (data) => {
        let temp = ""
        for(let i=0;i<data.length;i++){
            if(data[i]===":") {
                while(data[i]!==" "&&i<data.length) i++;
                temp += "-"
                continue
            }
            else {
                temp += data[i]
            }
        }
        return temp
    }

    const simplifyNormalip = (data) =>{
        let temp = ""
        for(let i=0;i<data.length;i++) {
            if(data[i]===" ") {
                while(i<data.length-1 && data[i+1]===" ") i++;
                temp += "-"
                continue
            }
            else {
                temp += data[i]
            }
        }
        temp += "-"
        console.log(temp)
        return temp;
    }

    const writedata = (data,tempstring)=> {
        let temp = ""
        for (let i=0;i<data.length;i++) {
            if(data[i]==="-") {
                allpromises.push(findLocation(temp,tempstring))
                temp = ""
            }
            else {
                temp += data[i]
            }
        } 
    }

    const findLocation = async (d,tempstring)=> {
        try {
            let storeCount = count;
            count++;
            const resp = await fetch(`http://ip-api.com/json/${d}`)
            const data = await resp.json()
            let {city,org} = data
            let latitude = data.lat
            let longitude = data.lon
            const tp = {city,org}
            const e = {latitude,longitude}
            coArray.push(e)
            const temp = JSON.stringify(tp)+"\n" 
            tempstring[storeCount] = data
            return new Promise(res=>{
                res()
            })
        }
        catch(e){
            throw new Error(e)
        }    
    }
    
    
    const temp = type===1?simplifyTorrenip(props):simplifyNormalip(props)
    console.log(temp)
    writedata(temp,tempstring)
    return (Promise.allSettled(allpromises)
    .then(()=>{
        return new Promise(resolve=>{
            resolve(tempstring)
        })
    }))



}




// validate ip ||  seperate torrent ip and normal ip || add div for selected point   