import Image from 'next/image';

const categories = [
  { id: 1, name: 'Men', img: '/category-men.jpg' },
  { id: 2, name: 'Women', img: '/category-women.jpg' },
  { id: 3, name: 'Kids', img: '/category-kids.jpg' },
];

export default function CategorySection() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={category.img}
              alt={category.name}
              width={500} // Set appropriate width
              height={256} // Set appropriate height
              layout="responsive" // Ensures responsive image loading
              objectFit="cover" // Similar to the object-cover class in Tailwind
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
