export const getProfileImage = (file: any) => {
  if (file) {
    if (typeof file === "string") {
      // Se for uma string (URL ou path local), retorna o objeto esperado pelo componente
      return { uri: file };
    }
    if (typeof file === "object" && file.uri) {
      return { uri: file.uri };
    }
  }

  // Para imagens estáticas com require, retorna o require diretamente
  return require("@/assets/images/icon.png");
};

export const getFilePath = (file: any) => {
  if (file) {
    if (typeof file === "string") {
      return { uri: file };
    }
    if (typeof file === "object" && file.uri) {
      return { uri: file.uri };
    }
  }

  return null;
};
