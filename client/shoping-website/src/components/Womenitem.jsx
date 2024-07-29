const Womenitem=()=>{
    const item=
    {
      "id": "002",
      "image": "images/2.jpg",
      "company": "CUKOO",
      "item_name": "Women Padded Halter Neck Swimming Dress",
      "original_price": 2599,
      "current_price": 1507,
      "discount_percentage": 42,
      "return_period": 14,
      "delivery_date": "10 Oct 2023",
      "rating": { "stars": 4.3, "count": 24 }
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
 export default Womenitem;