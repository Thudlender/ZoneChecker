import Loading from "./Loading"
import loadingAnimation from "../loading/loading.json"

const SuspenseContent = () => {
  return (
    <div className="w-full h-screen text-gray-400 bg-base-100">
        <div className="flex justify-center items-center h-full">
            <Loading animation={loadingAnimation} />
        </div>
    </div>
  );
};

export default SuspenseContent