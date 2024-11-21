export interface ProductIdentifier {
  ProductIDType: string; // ID Type, e.g., "15" for ISBN
  IDValue: string; // The actual identifier value
}

export interface Product {
  RecordReference: string; // The book's reference title
  ProductIdentifier: ProductIdentifier[]; // Array of identifiers (ISBN, etc.)
  NotificationType?: string; // Notification type
}

export interface ONIXMessage {
  Header: {
    Sender: {
      SenderName: string; // Name of the sender (e.g., publisher)
      ContactName?: string; // Contact person
      EmailAddress?: string; // Contact email
    };
    SentDateTime: string; // Date message was sent
  };
  Product: Product[]; // List of books/products
}
