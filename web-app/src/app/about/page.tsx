import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">About Pluma</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Pluma is a modern blogging platform designed for writers who
                value simplicity and elegance. Our mission is to provide a
                clean, distraction-free environment where your words can shine.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Built with modern technologies, Pluma offers a seamless writing
                experience while ensuring your content reaches readers in the
                most beautiful way possible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Simple
                </h3>
                <p className="text-gray-600">
                  Clean, intuitive interface for effortless writing
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Modern
                </h3>
                <p className="text-gray-600">
                  Built with cutting-edge web technologies
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Elegant
                </h3>
                <p className="text-gray-600">
                  Beautiful design that showcases your content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
