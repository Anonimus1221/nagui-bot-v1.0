module.exports = {
nome: "todesenho",
nomes: ["todesenho", "dibujar"],
uso: ["@imagen"],
run: async () => {
aumentartotalcmds();
aumentarcmdsgeral();
if (!isImagem) return enviar("⚠ Marca o responde a una imagen");
try {
const stream = await downloadContentFromMessage(isImagem, "image");
const chunks = [];
for await (const chunk of stream) chunks.push(chunk);
const buffer = Buffer.concat(chunks);
const url = await tourl(buffer);
if (!url) return enviar("❌ No se pudo generar la URL");

urlkk = `${urlapi}/api/ias/todesenho?query=${url}&apikey=${apikey}`
const data = await requisicaoComLimite(urlkk);
if (data.limite) {
return enviar(`${respuesta.limiteagotado} ${data.limite} ⏳`);
}



if (data?.data?.texto) {
  return enviarimg(data.data.texto, "*Listo*");
}


} catch (err) {
console.error("Erro:", err.message);
enviar("❌ Error al procesar la imagen");
}
},
};