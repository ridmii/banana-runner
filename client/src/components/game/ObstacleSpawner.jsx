import Obstacle from './Obstacle.jsx';

export default function ObstacleSpawner({ obstacles = [] }) {
  return (
    <>
      {obstacles.map((o, i) => (
        <Obstacle key={i} position={o.position} type={o.type} />
      ))}
    </>
  );
}
