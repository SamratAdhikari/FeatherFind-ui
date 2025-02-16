import { CircleCheck, Compass, FileChartPie, Radio } from "lucide-react";

const Home = () => {
    return (
        <div className="flex flex-col w-full h-auto items-center justify-center">
            {/* Home */}
            <div
                className="relative flex flex-col items-center justify-center h-[60vh] w-full gap-2 bg-cover bg-center"
                style={{ backgroundImage: 'url("/assets/Danfe.png")' }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>

                <h1 className="text-2xl md:text-4xl mb-4 loraFont font-semibold flex flex-col gap-2 items-center text-white relative">
                    Identify Bird Calls.
                    <span>Conserve Nature.</span>
                </h1>

                <p className="text-white relative loraFont">
                    {
                        "In the heart of Nepal, every bird's call carries a story of our natural heritage. Join us to safeguard their future."
                    }
                </p>

                <button className="bg-secondary py-2 px-4 rounded-lg shadow-xl hover:bg-[#61a3bd] transition duration-300 ease-in-out relative">
                    Get Started
                </button>
            </div>

            {/* Info */}
            <div className="h-[20vh] w-full flex items-center justify-between bg-secondary loraFont">
                <div className="flex flex-col items-center justify-center w-1/2 text-textPrimary">
                    <h1 className=" text-7xl">900+</h1>
                    <span className="text-lg text-textSecondary">Bird</span>
                    <span className="text-lg text-textSecondary">Species</span>
                </div>

                <div className="flex flex-col items-center justify-center w-1/2 text-textPrimary">
                    <h1 className=" text-7xl">167</h1>
                    <span className="text-lg text-textSecondary">
                        Threatened
                    </span>
                    <span className="text-lg text-textSecondary">Species</span>
                </div>

                <div className="flex flex-col items-center justify-center w-1/2 text-textPrimary">
                    <h1 className=" text-7xl">37</h1>
                    <span className="text-lg text-textSecondary">
                        Globally Threatened
                    </span>
                    <span className="text-lg text-textSecondary">Species</span>
                </div>

                <div className="flex flex-col items-center justify-center w-1/2 text-textPrimary">
                    <h1 className=" text-7xl">62</h1>
                    <span className="text-lg text-textSecondary">
                        Nearly Threatened
                    </span>
                    <span className="text-lg text-textSecondary">
                        Nationally Species
                    </span>
                </div>
            </div>

            {/* Features */}

            <div className="w-full h-auto bg-background flex flex-col items-center justify-center p-8 loraFont gap-2 my-2">
                <h1 className="text-4xl ">Our Features</h1>
                <h4 className="text-lg text-textSecondary">
                    Empowering Conservation with Advanced Tools and Insights
                </h4>

                <div className="flex items-center justify-between w-[80%] gap-6 my-4">
                    <div className="w-[25vw] h-[15vw] border border-gray-500 rounded-lg flex flex-col items-center justify-center shadow-lg">
                        <Radio className="w-32 h-32" />
                        <span className="text-lg text-textSecondary">
                            Record Audio
                        </span>
                    </div>
                    <div className="w-[25vw] h-[15vw] border border-gray-500 rounded-lg flex flex-col items-center justify-center shadow-lg">
                        <FileChartPie className="w-32 h-32" />
                        <span className="text-lg text-textSecondary">
                            Analyze Recording
                        </span>
                    </div>
                    <div className="w-[25vw] h-[15vw] border border-gray-500 rounded-lg flex flex-col items-center justify-center shadow-lg">
                        <Compass className="w-32 h-32" />
                        <span className="text-lg text-textSecondary">
                            Map Species
                        </span>
                    </div>
                </div>
            </div>

            {/* Pricing */}

            <div className="w-full h-auto bg-background flex flex-col items-center justify-center p-8 loraFont gap-2 my-2">
                <h1 className="text-4xl">Choose Your Pricing Plan</h1>
                <h4 className="text-lg text-textSecondary">
                    Choose the right plan for your Bird Conservation Journey
                </h4>

                <div className="flex items-center justify-between w-[80%] gap-4 my-4">
                    {/* free */}
                    <div className="w-[25vw] h-[25vw] border border-primary rounded-lg flex flex-col items-center justify-center shadow-lg text-textSecondary gap-4">
                        <h1 className="flex flex-col justify-center items-center text-xl">
                            Free
                            <span className="font-semibold ">Rs. 0/month</span>
                        </h1>

                        <div>Best for casual users and enthusiasts</div>

                        <div className="flex flex-col items-start justify-center gap-2 text-sm">
                            <p className=" flex justify-start gap-2">
                                <CircleCheck />
                                <span>
                                    Analyze up to 10 audio files per month.
                                </span>
                            </p>
                            <p className="flex gap-2">
                                <CircleCheck />
                                <span>
                                    Access to basic bird species database.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>
                                    View confidence scores and basic
                                    spectrogram.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>Limited to non-commercial use.</span>
                            </p>
                        </div>

                        <button className="px-4 py-2 text-textSecondary bg-secondary rounded-lg shadow-lg hover:bg-[#61a3bd] transition duration-300 ease-in-out">
                            Get Started
                        </button>
                    </div>

                    {/* individual */}
                    <div className="w-[25vw] h-[25vw] border border-primary bg-primary rounded-lg flex flex-col items-center justify-center shadow-lg text-background gap-4">
                        <h1 className="flex flex-col justify-center items-center text-xl">
                            Individual
                            <span className="font-semibold ">Rs. 99/month</span>
                        </h1>

                        <div>
                            Best for birdwatchers, researchers and educators.
                        </div>

                        <div className="flex flex-col items-start justify-center gap-2 text-sm">
                            <p className=" flex justify-start gap-2">
                                <CircleCheck />
                                <span>
                                    Analyze up to 100 audio files per month.
                                </span>
                            </p>
                            <p className="flex gap-2">
                                <CircleCheck />
                                <span>
                                    Access to extended bird species database.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>
                                    Downloadable reports and detailed
                                    spectrograms.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>
                                    Priority support for questions and
                                    troubleshooting.
                                </span>
                            </p>
                        </div>

                        <button className="px-4 py-2 text-textSecondary bg-secondary rounded-lg shadow-lg hover:bg-[#61a3bd] transition duration-300 ease-in-out">
                            Get Started
                        </button>
                    </div>

                    {/* organization */}
                    <div className="w-[25vw] h-[25vw] border border-primary rounded-lg flex flex-col items-center justify-center shadow-lg text-textSecondary gap-4">
                        <h1 className="flex flex-col justify-center items-center text-xl">
                            Organization
                            <span className="font-semibold ">
                                Rs. 999/month
                            </span>
                        </h1>

                        <div>
                            Best for conservation groups, NGOs & businesses.
                        </div>

                        <div className="flex flex-col items-start justify-center gap-2 text-sm">
                            <p className=" flex justify-start gap-2">
                                <CircleCheck />
                                <span>Unlimited audio analysis.</span>
                            </p>
                            <p className="flex gap-2">
                                <CircleCheck />
                                <span>
                                    Access to complete bird species database.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>
                                    API access for large-scale integrations.
                                </span>
                            </p>
                            <p className=" flex gap-2">
                                <CircleCheck />
                                <span>
                                    Custom training for specific regional
                                    species.
                                </span>
                            </p>
                        </div>

                        <button className="px-4 py-2 text-textSecondary bg-secondary rounded-lg shadow-lg hover:bg-[#61a3bd] transition duration-300 ease-in-out">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
