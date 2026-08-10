import React from 'react';
import MenuListCard from './MenuListCard';
import '../../styles/certmotion/MenuList.css';

export default function MenuList({ menuList = [] }) {
  return (
    <div className="card menu-list-container">
      <div className="menu-scroll-container">
        {menuList.map((item, index) => (
          <MenuListCard
            key={item.id}
            title={item.title}
            price={item.price}
            count={item.count}
            imgUrl={item.imgUrl}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}