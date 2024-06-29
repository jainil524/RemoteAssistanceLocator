const fetchData = async (url,headersList,bodyContent,method)=> {
    let response = await fetch(url, {
        method: method,
        body: bodyContent,
        headers: headersList
    });

    let data = await response.json();
  return data;
}
export default fetchData;