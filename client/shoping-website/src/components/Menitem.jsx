const Menitem=()=>{
   const item={
        "id": "008",
        "image": "images/8.jpg",
        "company": "Nivea",
        "item_name": "Men Fresh Deodrant 150ml",
        "original_price": 285,
        "current_price": 142,
        "discount_percentage": 50,
        "return_period": 14,
        "delivery_date": "10 Oct 2023",
        "rating": { "stars": 4.2, "count": 5200 }
      };
    
    return(
        <div className="item-container">
      <img className="item-image" src={item.image} alt="item image" />
      <div className="rating">
        {item.rating.stars} ⭐ | {item.rating.count}
      </div>
      <div className="company-name">{item.company}</div>
      <div className="item-name">{item.item_name}</div>
      <div className="price">
        <span className="current-price">Rs {item.current_price}</span>
        <span className="original-price">Rs {item.original_price}</span>
        <span className="discount">({item.discount_percentage}% OFF)</span>
      </div>
      </div>
    )
}
export default Menitem;