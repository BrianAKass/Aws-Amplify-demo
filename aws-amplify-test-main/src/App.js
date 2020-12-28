import React from "react";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Item } from "./models";

class App extends React.Component {
  state = {
    itemName: "",
    itemAmount: 0,
    items: [],
  };

  async componentDidMount() {
    await this.loadItems();
    DataStore.observe(Item).subscribe(this.loadItems);
  }

  loadItems = async () => {
    const items = await DataStore.query(Item, Predicates.ALL);
    this.setState({ items });
  };

  addItem = async () => {
    await DataStore.save(
      new Item({
        name: this.state.itemName,
        amount: this.state.itemAmount,
        purchased: false,
      })
    );
    this.setState({ itemAmount: 0, itemName: "" });
  };

  purchaseItem = (item) => () =>
    DataStore.save(
      Item.copyOf(item, (updated) => {
        updated.purchased = !updated.purchased;
      })
    );

  removeItem = (item) => () => DataStore.delete(item);

  render() {
    const { itemAmount, itemName, items } = this.state;

    return (
      <div style={{ maxWidth: 500, margin: "auto" }}>
        <h1>GROCERIZE</h1>
        <h2>Your Personal Grocery List</h2>
        <p>Add items to your grocery list!</p>
        <input
          placeholder="Gorcery Item"
          value={itemName}
          onChange={(e) => this.setState({ itemName: e.target.value })}
        />
        <input
          placeholder="Amount"
          type="number"
          value={itemAmount}
          onChange={(e) =>
            this.setState({ itemAmount: parseInt(e.target.value) })
          }
        />
        <button onClick={this.addItem}>Add</button>
        <h2>Groceries:</h2>
        <ul style={{ listStyleType: "none" }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{ fontWeight: item.purchased ? 100 : 700 }}
            >
              <button onClick={this.removeItem(item)}>remove</button>
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={this.purchaseItem(item)}
              />
              {" " + item.amount}x {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withAuthenticator(App);
