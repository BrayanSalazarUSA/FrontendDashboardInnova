import Loader from "react-js-loader";

const Loading = () => {
  return (
    <div className="w-full h-3/4 flex justify-center align-middle pt-44">
   
      <div className={"item"}>
                    <Loader type="ping-cube" bgColor={"rgb(194, 165, 0)"} color={"black"} title={"Searching..."} size={120} />
                </div>
      </div>
  )
}

export default Loading