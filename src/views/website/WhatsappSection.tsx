import WhatsappImg from '../../assets/whatsapp-services.svg'
import WhatsappTitleImg from '../../assets/title_whatsapp.svg'
import NotesIcon from '../../assets/icons/notes.svg'
import CodeIcon from '../../assets/icons/code.svg'
import ClockIcon from '../../assets/icons/clock.svg'
import SubmitIcon from '../../assets/icons/submit.svg'

const WhatsappSection = () => {
  return (
    <section id="whatsapp">
      <div className="mt-16 h-auto pb-5">
        <div className="flex flex-row justify-between items-center gap-20 container max-sm:flex-col max-sm:space-x-0 max-sm:gap-5">
          <div className="flex flex-col justify-between items-start flex-shrink-0 w-1/2 max-sm:w-10/12 space-y-5 max-sm:items-center max-sm:space-y-3">
            <img className='w-72' src={WhatsappTitleImg} alt='Title About' loading='lazy' />
            <div className='space-y-2'>
              <h2 className="text-primary text-xl font-bold max-sm:text-lg max-sm:text-center">
                Do You looking to send Whatsapp messages via API ?
              </h2>
              <p className="text-[#525252] text-base font-medium max-sm:text-base max-sm:text-center">Do your account with us and enjoy sending messages without storing your contacts and communicating directly with your customers.</p>
              <div className='flex flex-col items-start justify-between space-y-3'>
                <div className='flex flex-row items-center justify-between space-x-3 mt-5'>
                  <img src={NotesIcon} alt='Notes Icon' />
                  <p className='text-base font-semibold text-primary'>Send your invoices to your customers.</p>
                </div>
                <div className='flex flex-row items-center justify-between space-x-3'>
                  <img src={CodeIcon} alt='Notes Icon' />
                  <p className='text-base font-semibold text-primary'>Send the verification code to your apps.</p>
                </div>
                <div className='flex flex-row items-center justify-between space-x-3'>
                  <img src={ClockIcon} alt='Notes Icon' />
                  <p className='text-base font-semibold text-primary'>Send appointment reminders.</p>
                </div>
                <div className='flex flex-row items-center justify-between space-x-3'>
                  <img src={SubmitIcon} alt='Notes Icon' />
                  <p className='text-base font-semibold text-primary'>Submit your reservations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex-shrink-0 w-1/2 max-sm:mt-10 max-sm:w-full'>
            <img className="duration-300" src={WhatsappImg} alt="What'sapp" loading='lazy' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsappSection;
