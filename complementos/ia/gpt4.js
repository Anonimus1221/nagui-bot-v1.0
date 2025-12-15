module.exports = {
nome: "gpt4",
nomes: ["gpt4"],
desc: ["Haz una pregunta a la IA de GPT-4!"],
uso: ["Buenas noches, ¿qué fue la segunda guerra mundial?"],
run: async () => {
aumentartotalcmds();
aumentarcmdsgeral();
if (!q) return enviar(respuesta.textoparametro);


const url = `${urlapi}/api/ias/chatgpt?apikey=${apikey}&query=${encodeURIComponent(q)}`;


const resultado = await requisicaoComLimite(url);
if (resultado.limite) {
return enviar(`${respuesta.limiteagotado} ${resultado.limite} ⏳`);
}
if (resultado.success) {
return enviar(`*Resultado:* ${resultado.data.texto}`);
}

enviar("*⚠ Ningún resultado encontrado!*");
},
};