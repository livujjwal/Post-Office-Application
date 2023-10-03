const ipHeading1 = document.getElementById("ip-address-para");
const ipHeading2 = document.getElementById("ls1-heading");
const btn = document.getElementById("get-load-page");
const input = document.getElementById("input");
const container = document.getElementById("ls3-container");
const ipURL = "https://api.ipify.org?format=json";

// getIPAddress
async function getIPAddress() {
  try {
    const response1 = await fetch(ipURL);
    const data = await response1.json();
    ipHeading1.innerHTML = `Your Current IP Address is <span id="ip-address">${data.ip}</span>`;
    ipHeading2.innerHTML = `IP Address :<span> ${data.ip}</span>`;
    getAddress(data.ip);
  } catch (error) {
    alert(error);
  }
}
window.addEventListener('load',getIPAddress)

btn.addEventListener("click", () => {
  document.querySelector(".main-page").style.display = "none";
  document.querySelector(".load-page").style.display = "flex";
});

//getAddress
async function getAddress(IP) {
  try {
    const response = await fetch(
      `https://ipinfo.io/${IP}?token=65a31ec6c89a9d`
    );
    const data = await response.json();
    await getUserInfo(data.timezone);
    document.getElementById("ls1-display-1").innerHTML = `
 <p>Lat: <span> ${data.loc.substr(0, 7)} </span></p>
 <p>  City: <span> ${data.city} </span></p>
 <p> Organisation: <span>${data.org.substr(8,12)}</span></p>`;
    document.getElementById("ls1-display-2").innerHTML = `
 <p>Long: <span>${data.loc.substr(8)}</span></p>
                <p>Region: <span>${data.region}</span></p>
                <p>Country: <span>${data.country}</span></p>`;
     showGoogleMap(data.loc.substr(0, 7), data.loc.substr(8));
     getPostOffice(data.postal);
  } catch (error) {
    alert(error);
  }
}

// showGoogleMap
function showGoogleMap(lat, long) {
  try {
    document.getElementById(
      "google-map"
    ).innerHTML = `<iframe id="google-map-area" src="https://maps.google.com/maps?q=${lat}, ${long}&output=embed" frameborder="0" style="border:0"></iframe>`;
  } catch (error) {
    alert(error);
  }
}

//getUserInfo
async function getUserInfo(timezoneUser) {
  try {
    const date = new Date().toLocaleString("en-US", { timeZone: timezoneUser });
    document.getElementById("ls2-display-1").innerHTML = `
     <p>Time Zone: <span> ${timezoneUser} </span></p>
            <p>Date And Time: <span> ${date} </span></p>`;
  } catch (error) {
    alert(error);
  }
}
// getPostOffice
async function getPostOffice(pincode) {
  try {
    const postatlURL = `https://api.postalpincode.in/pincode/${pincode}`;
    const response = await fetch(postatlURL);
    const data = await response.json();
    document.getElementById("ls2-display-2").innerHTML = `
    <p>Pincode: <span>${pincode}</span></p>
    <p>Message: <span>${data[0]["Message"]}</span></p>`;
    const list = data[0]["PostOffice"];
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const word = input.value;
       let nameArray = list.map(info => {
            return info["Name"];
        });
       let flag = 0;
        nameArray.forEach((element,index) => {
            if (element === input.value) {
                flag = 1
                container.innerHTML = '';
                console.log(list[index].Name);
      const div = document.createElement("div");
      div.setAttribute("id", "ls3-display");
      div.innerHTML = `
    <p>Name: <span>${list[index].Name}</span></p>
    <p>Branch Type: <span>${list[index].BranchType}</span></p>
    <p>Delivery Status: <span>${list[index].DeliveryStatus}</span></p>
    <p>District: <span>${list[index].District}</span></p>
    <p>Division: <span>${list[index].Division}</span></p>`;
      container.append(div);
    } 
    });
            if(!flag){
                alert("Write full name of Address");
            }
      }
    });
    list.forEach((info) => {
      const div = document.createElement("div");
      div.setAttribute("id", "ls3-display");
      div.innerHTML = `
    <p>Name: <span>${info.Name}</span></p>
    <p>Branch Type: <span>${info.BranchType}</span></p>
    <p>Delivery Status: <span>${info.DeliveryStatus}</span></p>
    <p>District: <span>${info.District}</span></p>
    <p>Division: <span>${info.Division}</span></p>`;
      container.append(div);
    });
} catch (error) {
    alert(error)
}
}
