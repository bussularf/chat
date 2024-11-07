import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Integra o i18next ao React
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React já faz o escape dos valores
    },
    resources: {
      en: {
        users: {
          login: {
            error: "Verify credentials",
          },
          update: {
            success: "Password updated successfully.",
            invalid_password: "Incorrect current password.",
          },
          destroy: {
            success: "Account successfully deleted.",
            error: "Error deleting the account: %{error_message}",
          },
          verify_otp: {
            success: "OTP successfully verified.",
            error: "Invalid OTP code.",
          },
          require_otp: "OTP is required",
        },
        conversations: {
          create: {
            error: "Error creating conversation: %{errors}",
          },
        },
        messages: {
          create: {
            success: "Message created successfully.",
          },
          update: {
            not_authorized: "You are not authorized to update this message.",
          },
          destroy: {
            not_authorized: "You are not authorized to delete this message.",
          },
          set_message: {
            not_found: "Message not found.",
          },
        },
      },
      pt: {
        users: {
          login: {
            error: "Verifique credenciais",
          },
          update: {
            success: "Senha atualizada com sucesso.",
            invalid_password: "Senha atual incorreta.",
          },
          destroy: {
            success: "Conta excluída com sucesso.",
            error: "Erro ao excluir a conta: %{error_message}",
          },
          verify_otp: {
            success: "OTP verificado com sucesso.",
            error: "Código OTP inválido.",
          },
          require_otp: "OTP é necessário",
        },
        conversations: {
          create: {
            error: "Erro ao criar a conversa: %{errors}",
          },
        },
        messages: {
          create: {
            success: "Mensagem criada com sucesso.",
          },
          update: {
            not_authorized: "Você não tem permissão para atualizar esta mensagem.",
          },
          destroy: {
            not_authorized: "Você não tem permissão para excluir esta mensagem.",
          },
          set_message: {
            not_found: "Mensagem não encontrada.",
          },
        },
      },
    },
  });

export default i18n;
