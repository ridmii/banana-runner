import Banana from './Banana.jsx';

export default function BananaSpawner({ bananas = [] }) {
  return (
    <>
      {bananas.map((p, i) => (
        <Banana key={i} position={p} />
      ))}
    </>
  );
}
