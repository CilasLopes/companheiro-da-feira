export const defaultFairSchedules = [
  { id: 1, day: 'Saturday', startTime: '07:00', endTime: '13:00', location: 'No Parque', accessibility: 'Acessível para cadeirantes' }
];

export const defaultRecipes = [
  { id: 1, title: 'Risoto de Alho Poró', time: '30 min', diff: 'Médio', intro: 'Um clássico cremoso usando o frescor da feira.', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=400&auto=format&fit=crop' },
  { id: 2, title: 'Smoothie de Verão', time: '5 min', diff: 'Fácil', intro: 'Energia pura com frutas da estação.', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400&auto=format&fit=crop' }
];

export const defaultSeasonalItems = [
  { id: 1, name: 'Morango', benefit: 'Vitamina C', img: 'https://images.unsplash.com/photo-1464960350423-93c66257df90?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Brócolis', benefit: 'Ferro', img: 'https://images.unsplash.com/photo-1453133451515-5ff7c1d0ded6?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Alho Poró', benefit: 'Saúde Digestiva', img: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=400&auto=format&fit=crop' }
];

export const defaultEvents = [
  { id: 1, title: 'Workshop de Compostagem', desc: 'Aprenda técnicas práticas para transformar restos orgânicos em adubo rico para suas plantas.', day: '15', month: 'MAIO', time: '09:00', local: 'Espaço Verde', fullDate: '2024-05-15' },
  { id: 2, title: 'Jazz no Parque', desc: 'Uma tarde agradável com música ao vivo, trazendo os melhores músicos locais para o gramado.', day: '22', month: 'MAIO', time: '11:00', local: 'Gramado Central', fullDate: '2024-05-22' }
];

export const defaultItems = [
  { id: 1, name: 'Bananas Prata', desc: '1 dúzia, bem maduras', category: 'Frutas', found: false, bought: false },
  { id: 2, name: 'Maçã Gala', desc: '6 unidades', category: 'Frutas', found: true, bought: false },
  { id: 3, name: 'Cenoura', desc: '500g, com rama se possível', category: 'Legumes', found: false, bought: false },
  { id: 4, name: 'Mel Orgânico', desc: '1 pote de 500g', category: 'Mercearia', found: true, bought: true },
];

export const defaultProducts = [
  // Verduras
  { id: 1, name: 'Alface Crespa Orgânica', type: 'Verduras', price: 'R$ 4,50', img: 'https://images.unsplash.com/photo-1622206141540-5844544d3fa5?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Couve Manteiga Brasil', type: 'Verduras', price: 'R$ 4,19', img: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Espinafre Fresco', type: 'Verduras', price: 'R$ 5,50', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Rúcula Hidropônica', type: 'Verduras', price: 'R$ 6,00', img: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=400&auto=format&fit=crop' },
  
  // Legumes
  { id: 5, name: 'Tomate Italiano', type: 'Legumes', price: 'R$ 8,20', img: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?q=80&w=400&auto=format&fit=crop' },
  { id: 6, name: 'Cenoura Baby', type: 'Legumes', price: 'R$ 6,00', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&auto=format&fit=crop' },
  { id: 7, name: 'Abobrinha Italiana', type: 'Legumes', price: 'R$ 5,90', img: 'https://images.unsplash.com/photo-1592394933324-998256749899?q=80&w=400&auto=format&fit=crop' },
  { id: 8, name: 'Pepino Japonês', type: 'Legumes', price: 'R$ 7,50', img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?q=80&w=400&auto=format&fit=crop' },

  // Frutas
  { id: 9, name: 'Morango da Estação', type: 'Frutas', price: 'R$ 12,00', img: 'https://images.unsplash.com/photo-1464960350423-93c66257df90?q=80&w=400&auto=format&fit=crop' },
  { id: 10, name: 'Banana Prata', type: 'Frutas', price: 'R$ 6,50', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop' },
  { id: 11, name: 'Maçã Gala Selecionada', type: 'Frutas', price: 'R$ 9,80', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400&auto=format&fit=crop' },
  { id: 12, name: 'Manga Palmer', type: 'Frutas', price: 'R$ 7,90', img: 'https://images.unsplash.com/photo-1553134833-1c02e5595541?q=80&w=400&auto=format&fit=crop' },

  // Temperos
  { id: 13, name: 'Manjericão Fresco', type: 'Temperos', price: 'R$ 3,50', img: 'https://images.unsplash.com/photo-1618375531912-77cd308f888e?q=80&w=400&auto=format&fit=crop' },
  { id: 14, name: 'Alecrim em Raminho', type: 'Temperos', price: 'R$ 4,00', img: 'https://images.unsplash.com/photo-1515981910044-db084041b3e9?q=80&w=400&auto=format&fit=crop' },
  { id: 15, name: 'Hortelã Fresca', type: 'Temperos', price: 'R$ 3,50', img: 'https://images.unsplash.com/photo-1601004890684-d8cbf393f922?q=80&w=400&auto=format&fit=crop' },

  // Orgânicos
  { id: 16, name: 'Ovos Caipira (Dúzia)', type: 'Orgânicos', price: 'R$ 18,00', img: 'https://images.unsplash.com/photo-1518569739504-2070f7d54972?q=80&w=400&auto=format&fit=crop' },
  { id: 17, name: 'Mel Silvestre 500g', type: 'Orgânicos', price: 'R$ 22,00', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400&auto=format&fit=crop' },
];

export const defaultRestaurants = [
  { id: 1, name: 'Terra Viva', type: 'Vegano', address: 'Av. Paulista', number: '1000', hours: '08:00 às 20:00', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Horta & Sabor', type: 'Vegetariano', address: 'Rua Augusta', number: '500', hours: '11:00 às 15:00', img: 'https://images.unsplash.com/photo-1498837167922-41c53b448419?q=80&w=400&auto=format&fit=crop' },
];

export const defaultCafeItems = [
  { 
    id: 1, 
    name: 'Café Coado Arabica', 
    price: 'R$ 8,00', 
    category: 'Bebidas',
    description: 'Um café suave e aromático, selecionado das melhores montanhas.',
    ingredients: 'Grãos 100% Arabica, água mineral.',
    process: 'Passado na hora no filtro de pano artesanal.',
    img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop'
  },
  { 
    id: 2, 
    name: 'Pão de Queijo Canastra', 
    price: 'R$ 6,00', 
    category: 'Salgados',
    description: 'O clássico mineiro com queijo canastra real.',
    ingredients: 'Polvilho artesanal, queijo canastra curado, leite, ovos caipiras.',
    process: 'Assado lentamente em forno de pedra.',
    img: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=400&auto=format&fit=crop'
  },
];
