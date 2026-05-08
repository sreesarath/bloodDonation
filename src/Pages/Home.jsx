import React from 'react';

import Header from '../Components/Header';

import { Search, AlertCircle, ShieldCheck, Heart, MapPin, UserPlus, PhoneCall, CheckCircle2 } from 'lucide-react';

import Footer from '../Components/Footer';

import { Link } from 'react-router-dom';



const Home = () => {

  const steps = [

    {

      title: "Register/Login",

      desc: "Create your profile in seconds. Join as a donor or a seeker.",

      icon: <UserPlus className="text-blue-600" size={28} />,

      color: "bg-blue-100"

    },

    {

      title: "Search or Request",

      desc: "Find donors by blood group and location or post an emergency request.",

      icon: <Search className="text-red-600" size={28} />,

      color: "bg-red-100"

    },

    {

      title: "Get Connected",

      desc: "Contact donors directly via secure calling or messaging features.",

      icon: <PhoneCall className="text-green-600" size={28} />,

      color: "bg-green-100"

    }

  ];



  return (

    <>

        <div className="min-h-screen bg-slate-50 selection:bg-red-100 selection:text-red-600">

      <Header />



      {/* Hero Section */}

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">

        {/* Advanced Background: Grid + Glow */}

        <div className="absolute inset-0 -z-10">

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-100px,#fee2e2,transparent)]"></div>

        </div>



        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

         

          {/* LEFT CONTENT */}

          <div className="space-y-8 text-center lg:text-left">

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm">

              <span className="relative flex h-3 w-3">

                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>

                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>

              </span>

              Live: 24/7 Emergency Support

            </div>



            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">

              Life is Precious. <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">

                Blood is Life.

              </span>

            </h1>



            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">

              The smartest way to find blood donors. Verified, location-based, and built for

              instant emergency response.

            </p>



            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">

             <Link to={'/request'}>

              <button className="group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-200 transition-all hover:-translate-y-1 active:scale-95">

                <AlertCircle size={20} className="group-hover:rotate-12 transition-transform" />

                Emergency Request

              </button>

             </Link>



              <Link to={'/donors'}>

              <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-red-600 text-slate-900 px-8 py-4 rounded-2xl font-bold shadow-sm transition-all hover:-translate-y-1">

                <Search size={20} />

                Browse Donors

              </button>

              </Link>

            </div>

          </div>



          {/* RIGHT VISUAL */}

          <div className="relative">

            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-slate-200">

              <img

                src="src/assets/home-pageImg-2.avif"

                alt="Donation"

                className="w-full h-[500px] object-cover"

              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

            </div>



            {/* Floating Achievement Card */}

            <div className="absolute -bottom-10 -right-4 md:right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 animate-float">

              <div className="flex items-center gap-4">

                <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-200">

                  <Heart fill="currentColor" size={24} />

                </div>

                <div>

                  <p className="text-3xl font-black text-slate-900">12.5k</p>

                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lives Impacted</p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* HOW IT WORKS SECTION */}

      <section className="py-24 bg-white relative">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center space-y-4 mb-16">

            <h2 className="text-red-600 font-bold tracking-[0.2em] uppercase text-sm">Our Process</h2>

            <h3 className="text-4xl lg:text-5xl font-black text-slate-900">How BloodFinder Works</h3>

            <p className="text-slate-500 max-w-2xl mx-auto text-lg">

              Three simple steps to save a life. Our platform is optimized for maximum speed in critical moments.

            </p>

          </div>



          <div className="grid md:grid-cols-3 gap-8 relative">

            {/* Connecting Line (Desktop Only) */}

            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-100 -z-0"></div>



            {steps.map((step, idx) => (

              <div key={idx} className="relative z-10 group">

                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2">

                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>

                    {step.icon}

                  </div>

                  <h4 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">

                    <span className="text-slate-300 font-black text-4xl">0{idx + 1}</span>

                    {step.title}

                  </h4>

                  <p className="text-slate-600 leading-relaxed">

                    {step.desc}

                  </p>

                </div>

              </div>

            ))}

          </div>



          {/* Quick Action Banner */}

          <div className="mt-20 bg-slate-900 rounded-[3rem] p-8 md:p-12 overflow-hidden relative group">

            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

              <div className="text-center md:text-left space-y-2">

                <h4 className="text-3xl font-bold text-white">Ready to make a difference?</h4>

                <p className="text-slate-400">Join our community of heroes today. It takes less than 2 minutes.</p>

              </div>

            <Link to={'/donor-register'}>

              <button className="bg-white text-slate-900 hover:bg-red-600 hover:text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">

                Register as a Donor

              </button>

           

            </Link>

            </div>

          </div>

        </div>

      </section>



      {/* Footer / Trust Stats */}

      <footer className="py-12 border-t border-slate-100">

         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 text-slate-400 opacity-70 italic font-medium">

            <div className="flex items-center gap-2"> <CheckCircle2 size={20}/> Privacy Encrypted </div>

            <div className="flex items-center gap-2"> <MapPin size={20}/> Real-time Tracking </div>

            <div className="flex items-center gap-2"> <ShieldCheck size={20}/> Verified Community </div>

         </div>

      </footer>

    </div>

    <Footer/>

    </>



  );

};



export default Home;