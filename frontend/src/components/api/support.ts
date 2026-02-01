import {
  limit,
  VITE_BACKEND_URL,
  type CreateMessageRequest,
  type CreateSupportRequest,
  type Message,
  type SupportRequest,
  type User,
} from "../../utils/utils";

export interface MarkMessagesAsReadRequestData {
  activeSupportRequestId: string;
  userId: string;
  createdBefore: string;
}

export const markMessagesAsReadRequest = async (
  requestData: MarkMessagesAsReadRequestData,
) => {
  try {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/common/support-requests/${
        requestData.activeSupportRequestId
      }/messages/read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: requestData.userId,
          supportRequest: requestData.activeSupportRequestId,
          createdBefore: requestData.createdBefore,
        }),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`Ошибка при пометке сообщений как прочитанных: ${error}`);
    }
  } catch (error) {
    console.error(`Ошибка при пометке сообщений как прочитанных: ${error}`);
  } finally {
  }
};

export interface GetSupportRequestsData {
  userId: string;
  role: string;
}

export const getSupportRequestsRequest = async (
  requestData: GetSupportRequestsData,
): Promise<SupportRequest[] | undefined> => {
  try {
    const url = new URL(
      `${VITE_BACKEND_URL}/api/${requestData.role}/support-requests`,
    );
    url.searchParams.append("user", requestData.userId);
    url.searchParams.append("isActive", "true");
    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ошибка: ${error}`);
    }

    const data: SupportRequest[] = await response.json();

    return data;
  } catch (error) {
    console.log("Ошибка: ", error);
  }
};

export interface SendCreateNewSupportRequestData {
  message: CreateMessageRequest;
  role: string;
}

export const sendCreateNewSupportRequest = async (
  requestData: SendCreateNewSupportRequestData,
): Promise<SupportRequest | undefined> => {
  try {
    const createSupportRequest: CreateSupportRequest = {
      user: requestData.message.author,
      text: requestData.message.text,
    };

    const response = await fetch(
      `${VITE_BACKEND_URL}/api/${requestData.role}/support-requests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createSupportRequest),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ошибка при создании запроса в поддержку: ${error}`);
    }

    const data: SupportRequest = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Ошибка при создании запроса в поддержку: ${error}`);
  }
};

export interface SendCreateNewMessageRequestData {
  activeSupportRequestId: string;
  message: CreateMessageRequest;
}

export const sendCreateNewMessageRequest = async (
  requestData: SendCreateNewMessageRequestData,
) => {
  try {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/common/support-requests/${requestData.activeSupportRequestId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData.message),
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ошибка при отправке сообщения: ${error}`);
    }
  } catch (error) {
    throw new Error(`Ошибка при отправке сообщения: ${error}`);
  }
};

export interface GetUsersRequestData {
  currentNumber: number;
  itemsOnPage: number;
  role: string;
}

export const getUsersRequest = async (
  requestData: GetUsersRequestData,
): Promise<User[] | undefined> => {
  try {
    const url: string = `${VITE_BACKEND_URL}/api/${requestData.role}/users?limit=${limit.toString()}&offset=${(
      (requestData.currentNumber - 1) *
      requestData.itemsOnPage
    ).toString()}`;

    const response = await fetch(url, { credentials: "include" });
    const data: User[] = await response.json();

    return data;
  } catch (error) {
    console.log("Ошибка: ", error);
  }
};

export interface GetUnreadCountRequestData {
  activeSupportRequestId: string;
}
export const getUnreadCountRequest = async (
  requestData: GetUnreadCountRequestData,
): Promise<Message[] | undefined> => {
  try {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/common/support-requests/unread-count/${requestData.activeSupportRequestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const data: Message[] = await response.json();
    return data;
  } catch (error) {
    console.log("Ошибка: ", error);
  }
};

export interface SendCloseSupportRequestData {
  activeSupportRequestId: string;
}

export const sendCloseSupportRequest = async (
  requestData: SendCloseSupportRequestData,
) => {
  try {
    const response = await fetch(
      `${VITE_BACKEND_URL}/api/common/support-requests/close/${requestData.activeSupportRequestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ошибка при закрытии запроса: ${error}`);
    }
  } catch (error) {
    throw new Error(`Ошибка при закрытии запроса: ${error}`);
  }
};
