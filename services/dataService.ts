import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const DB_NAME = "finance_app.db"; // O nome que deste no drizzle/sqlite
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export const BackupService = {
  // 1. Exportar o banco atual para fora do app
  handleBackup: async () => {
    try {
      // Verificar se o ficheiro do banco existe
      const fileInfo = await FileSystem.getInfoAsync(DB_PATH);
      if (!fileInfo.exists) {
        Alert.alert("Erro", "Banco de dados não encontrado.");
        return;
      }

      // Criar uma cópia temporária para partilhar
      const backupUri = `${FileSystem.cacheDirectory}${DB_NAME}`;
      await FileSystem.copyAsync({
        from: DB_PATH,
        to: backupUri,
      });

      // Abrir o menu de partilha (WhatsApp, Google Drive, pasta local)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(backupUri, {
          dialogTitle: "Guardar Backup",
          mimeType: "application/octet-stream",
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao gerar backup.");
    }
  },

  // 2. Importar um ficheiro .db e substituir o atual
  handleRestore: async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // No Android, pode ser necessário filtrar por extensão se possível
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const selectedFile = result.assets[0];

      // Alerta de confirmação (Crucial, pois vai apagar os dados atuais)
      Alert.alert(
        "Confirmar Restore",
        "Isto irá substituir todos os dados atuais. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sim, Restaurar",
            onPress: async () => {
              // Garantir que a pasta SQLite existe
              const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
              const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDir, {
                  intermediates: true,
                });
              }

              // Substituir o ficheiro atual pelo selecionado
              await FileSystem.copyAsync({
                from: selectedFile.uri,
                to: DB_PATH,
              });

              Alert.alert(
                "Sucesso",
                "Dados restaurados! Reinicie o app para aplicar.",
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao restaurar dados.");
    }
  },
};
