exports.handler = async function (event, context) {
    const value = process.env.CLIENT_ID;
  
    return {
      statusCode: 200,
      body: JSON.stringify({ CLIENT_ID: value }),
    };  
  };