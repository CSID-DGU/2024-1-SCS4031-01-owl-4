import heroImage from '../../assets/images/HeroImage.jpeg'

const Hero = () => {
  return (
    <section className="w-full h-screen mt-24 text-white" id='hero'>
      <div className="w-full h-full flex">
        <div className="w-1/4 bg-black/10"></div>
        <div className="w-1/2">
          <img src={heroImage} alt="Hero_Image" className=' opacity-70'/>
        </div>
        <div className='w-1/4 bg-black/10'></div>
      </div>
    </section>
  )
}

export default Hero