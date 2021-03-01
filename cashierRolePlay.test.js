class Product {
  constructor({
    productName,
    price,
    quantity = 1,
    discount = 0,
    selfBuyX = 1,
    selfGetY = 0,
    crossDiscountSelfQuantity = 1,
    crossDiscountTargetName = "",
    crossDiscountTargetQuantity = 0
  }) {
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
    this.discount = discount;
    this.selfBuyX = selfBuyX;
    this.selfGetY = selfGetY;
    this.crossDiscountSelfQuantity = crossDiscountSelfQuantity;
    this.crossDiscountTargetName = crossDiscountTargetName;
    this.crossDiscountTargetQuantity = crossDiscountTargetQuantity;
  }

  getDiscountPercentage() {
    return `${this.discount}%`;
  }

  getDiscountPrice() {
    return this.price * this.quantity * (this.discount / 100);
  }

  getSubtotal() {
    return this.price * this.quantity * (1 - this.discount / 100);
  }

  getFreeQuantity() {
    return Math.floor(this.quantity / this.selfBuyX) * this.selfGetY;
  }
}

class OrderList {
  constructor(cashierName, dateTime) {
    this.cashierName = cashierName;
    this.dateTime = new Date().toLocaleString();
    this.items = [];
    this.grandTotal = 0;
  }

  scan(product) {
    this.items.push({
      ...product,
      discountPercentage: product.getDiscountPercentage(),
      discountPrice: product.getDiscountPrice(),
      subtotal: product.getSubtotal(),
      freeQuantity: product.getFreeQuantity()
    });
    this.grandTotal += product.getSubtotal();
    return this.items;
  }

  removeItemByName(name) {
    this.items = this.items.filter((e) => e.productName !== name);
  }

  printListing() {
    return {
      itemsList: this.items,
      grandTotal: this.grandTotal
    };
  }
}

function testRequirement1() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 3
  });
  return orderList.scan(apple);
}
test("requirement1 scan and get total", () => {
  expect(testRequirement1()).toEqual([
    {
      productName: "Apple",
      price: 4.0,
      quantity: 3,
      discount: 0,
      selfBuyX: 1,
      selfGetY: 0,
      crossDiscountSelfQuantity: 1,
      crossDiscountTargetName: "",
      crossDiscountTargetQuantity: 0,
      discountPercentage: "0%",
      discountPrice: 0,
      subtotal: 4.0 * 3,
      freeQuantity: 0
    }
  ]);
});

function testRequirement2() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 3
  });
  orderList.scan(apple);
  orderList.removeItemByName("Apple");
  return orderList.items;
}
test("requirement2 cancel from order", () => {
  expect(testRequirement2()).toEqual([]);
});

function testRequirement3() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 3
  });
  const milk = new Product({
    productName: "Milk",
    price: 9.41,
    quantity: 3
  });
  orderList.scan(apple);
  orderList.scan(milk);
  return orderList.printListing();
}
test("requirement3 print listing", () => {
  expect(testRequirement3()).toEqual({
    itemsList: [
      {
        productName: "Apple",
        price: 4.0,
        quantity: 3,
        discount: 0,
        selfBuyX: 1,
        selfGetY: 0,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPercentage: "0%",
        discountPrice: 0,
        subtotal: 4.0 * 3,
        freeQuantity: 0
      },
      {
        productName: "Milk",
        price: 9.41,
        quantity: 3,
        discount: 0,
        selfBuyX: 1,
        selfGetY: 0,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPrice: 0,
        discountPercentage: "0%",
        subtotal: 9.41 * 3,
        freeQuantity: 0
      }
    ],
    grandTotal: 4.0 * 3 + 9.41 * 3
  });
});

function testRequirement4() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 3,
    discount: 5
  });
  const coke = new Product({
    productName: "Coke",
    price: 12.1,
    quantity: 3,
    discount: 10
  });
  orderList.scan(apple);
  orderList.scan(coke);
  return orderList.printListing();
}
test("requirement4 print listing with discount", () => {
  expect(testRequirement4()).toEqual({
    itemsList: [
      {
        productName: "Apple",
        price: 4.0,
        quantity: 3,
        discount: 5,
        selfBuyX: 1,
        selfGetY: 0,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPercentage: "5%",
        discountPrice: 4.0 * 3 * (5 / 100),
        subtotal: 4.0 * 3 * (1 - 5 / 100),
        freeQuantity: 0
      },
      {
        productName: "Coke",
        price: 12.1,
        quantity: 3,
        discount: 10,
        selfBuyX: 1,
        selfGetY: 0,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPercentage: "10%",
        discountPrice: 12.1 * 3 * (10 / 100),
        subtotal: 12.1 * 3 * (1 - 10 / 100),
        freeQuantity: 0
      }
    ],
    grandTotal: 4.0 * 3 * (1 - 5 / 100) + 12.1 * 3 * (1 - 10 / 100)
  });
});

function testRequirement5() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 33,
    discount: 5,
    selfBuyX: 5,
    selfGetY: 1
  });
  const coke = new Product({
    productName: "Coke",
    price: 12.1,
    quantity: 20,
    discount: 10,
    selfBuyX: 5,
    selfGetY: 2
  });
  orderList.scan(apple);
  orderList.scan(coke);
  return orderList.printListing();
}
test("requirement5 print listing with buyX getY logic", () => {
  expect(testRequirement5()).toEqual({
    itemsList: [
      {
        productName: "Apple",
        price: 4.0,
        quantity: 33,
        discount: 5,
        selfBuyX: 5,
        selfGetY: 1,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPercentage: "5%",
        discountPrice: 4.0 * 33 * (5 / 100),
        subtotal: 4.0 * 33 * (1 - 5 / 100),
        freeQuantity: Math.floor(33 / 5) * 1
      },
      {
        productName: "Coke",
        price: 12.1,
        quantity: 20,
        discount: 10,
        selfBuyX: 5,
        selfGetY: 2,
        crossDiscountSelfQuantity: 1,
        crossDiscountTargetName: "",
        crossDiscountTargetQuantity: 0,
        discountPercentage: "10%",
        discountPrice: 12.1 * 20 * (10 / 100),
        subtotal: 12.1 * 20 * (1 - 10 / 100),
        freeQuantity: Math.floor(20 / 5) * 2
      }
    ],
    grandTotal: 4.0 * 33 * (1 - 5 / 100) + 12.1 * 20 * (1 - 10 / 100)
  });
});

function testRequirement6() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 33,
    discount: 0,
    selfBuyX: 5,
    selfGetY: 1
  });
  const milk = new Product({
    productName: "Milk",
    price: 9.41,
    quantity: 20,
    discount: 10
  });
  const coke = new Product({
    productName: "Coke",
    price: 12.1,
    quantity: 20,
    discount: 10,
    selfBuyX: 5,
    selfGetY: 2
  });
  orderList.scan(apple);
  orderList.scan(milk);
  orderList.scan(coke);
  let suggestions = [];
  orderList.items.forEach((e) => {
    if (e.discount > 0)
      suggestions.push(`${e.discount}% discount for ${e.productName}`);
    if (e.selfGetY > 0)
      suggestions.push(
        `${e.selfGetY} ${
          e.productName + (e.selfGetY > 1 ? "s" : "")
        } for free per ${e.selfBuyX} ${
          e.productName + (e.selfBuyX > 1 ? "s" : "")
        } were bought`
      );
  });
  return suggestions;
}
test("requirement6 suggest eligible special offers", () => {
  expect(testRequirement6()).toEqual([
    "1 Apple for free per 5 Apples were bought",
    "10% discount for Milk",
    "10% discount for Coke",
    "2 Cokes for free per 5 Cokes were bought"
  ]);
});

function testRequirement7() {
  const orderList = new OrderList("Peter");
  const apple = new Product({
    productName: "Apple",
    price: 4.0,
    quantity: 33,
    discount: 0,
    selfBuyX: 5,
    selfGetY: 1,
    crossDiscountSelfQuantity: 10,
    crossDiscountTargetName: "Milk",
    crossDiscountTargetQuantity: 1
  });
  const milk = new Product({
    productName: "Milk",
    price: 9.41,
    quantity: 20,
    discount: 10,
    selfBuyX: 1,
    selfGetY: 0,
    crossDiscountSelfQuantity: 5,
    crossDiscountTargetName: "Coke",
    crossDiscountTargetQuantity: 1
  });
  orderList.scan(apple);
  orderList.scan(milk);
  let suggestions = [];
  orderList.items.forEach((e) => {
    if (e.discount > 0) {
      suggestions.push(`${e.discount}% discount for ${e.productName}`);
    }
    if (e.selfGetY > 0) {
      suggestions.push(
        `${e.selfGetY} ${
          e.productName + (e.selfGetY > 1 ? "s" : "")
        } for free per ${e.selfBuyX} ${
          e.productName + (e.selfBuyX > 1 ? "s" : "")
        } were bought`
      );
    }
    if (e.crossDiscountTargetQuantity > 0) {
      suggestions.push(
        `${e.crossDiscountTargetQuantity} ${
          e.crossDiscountTargetName +
          (e.crossDiscountTargetQuantity > 1 ? "s" : "")
        } for free per ${e.crossDiscountSelfQuantity} ${
          e.productName + (e.crossDiscountSelfQuantity > 1 ? "s" : "")
        } were bought`
      );
    }
  });
  return suggestions;
}
test("requirement7 cross product discounts", () => {
  expect(testRequirement7()).toEqual([
    "1 Apple for free per 5 Apples were bought",
    "1 Milk for free per 10 Apples were bought",
    "10% discount for Milk",
    "1 Coke for free per 5 Milks were bought"
  ]);
});
