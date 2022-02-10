import {
  SearchIcon,
  RefreshIcon,
  DotsVerticalIcon,
  PlusIcon,
} from '@heroicons/react/solid';
import { UserAddIcon, UserIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { LoadingDirectory } from '../../common/Loading';

const FREELANCERS = gql`
  query GetFreelancers(
    $pagination: PaginationArg
    $filters: FreelancerFiltersInput
    $sort: [String]
  ) {
    freelancers(pagination: $pagination, filters: $filters, sort: $sort) {
      data {
        id
        attributes {
          imageUrl
          firstName
          lastName
          phoneNumber
          availableFrom
          competence
          hourlyRate
          availableFrom
        }
      }
    }
  }
`;

export default function FreelancersDashboard() {
  const {
    loading,
    error,
    data,
    refetch: refetchDirectory,
  } = useQuery(FREELANCERS, {
    variables: {
      sort: 'availableFrom',
      pagination: { pageSize: 1000 },
      // filters: {
      //   availableFrom: {
      //     lte: '2022-01-21T00:00:00.000Z',
      //   },
      // },
    },
    pollInterval: 2000,
  });

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      search: '',
    },
  });

  function onSubmit(e) {
    refetchDirectory({
      filters: {
        or: [
          {
            lastName: {
              containsi: e.search,
            },
          },
          {
            competence: {
              containsi: e.search,
            },
          },
        ],
      },
    });
  }

  function checkKeyDown(key) {
    //if (key.code === 'Enter') key.preventDefault();
    if (key.code === 'Escape') {
      resetField('search');
      refetchDirectory({
        filters: {
          lastName: {
            containsi: '',
          },
        },
      });
    }
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  if (loading) return <LoadingDirectory />;
  if (error) return `Error! ${error}`;

  return (
    <>
      <main className='max-w-7xl w-full mx-auto px-3 lg:px-8 flex flex-col'>
        {/* Start secondary column (hidden on smaller screens) */}
        <div className='flex flex-col border-b border-gray-200 items-center pt-6 pb-4'>
          <h2 className='text-lg font-medium text-gray-900'>
            Available Freelancers
          </h2>
          <p className='mt-1 text-sm text-gray-600'>
            Search directory of {data?.freelancers.data.length} freelancer
            {data?.freelancers.data.length !== 1 && 's'}
          </p>
          <form
            className='w-full mt-6 flex justify-center space-x-4'
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(key) => checkKeyDown(key)}
          >
            <div className='max-w-lg flex-1 min-w-0'>
              <label htmlFor='search' className='sr-only'>
                Search
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <SearchIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
                <input
                  type='text'
                  autoComplete='off'
                  {...register('search')}
                  className='focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md w-full'
                  placeholder='Last name / Competence'
                />
              </div>
            </div>
            <button
              type='submit'
              // onClick={() => {
              //   navigate('/freelancers/add');
              // }}
              className='inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <RefreshIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
              <span className='sr-only'>Search</span>
            </button><Link
              // onClick={() => {
              //   navigate('/freelancers/add');
              // }}
              to='/freelancers/add'
              className='inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <PlusIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              <span className='sr-only'>Search</span>
            </Link>
          </form>
        </div>
        {/* Directory list */}
        <h3 className='sr-only'>Freelancers</h3>
        <div className='overflow-y-hidden'>
          <ul className='py-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {!data.freelancers.data.length ? (
              <div className='relative rounded-lg border border-dashed border-gray-300 group py-2 px-3 shadow-sm flex items-center space-x-4 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
                <div
                  //to={`/tasks/${task.id}`}
                  className='-m-1 flex-1 block p-1'
                >
                  <div className='absolute inset-0' aria-hidden='true' />
                  <div className='flex-1 flex items-center min-w-0 relative'>
                    <span className='flex-shrink-0 inline-block relative'>
                      <UserIcon
                        className='border bg-gray-50 rounded-full p-1 text-gray-400 flex-shrink-0 h-12 w-12'
                        aria-hidden='true'
                      />
                      {/* <img
                className='border h-12 w-12 rounded-full'
                src={freelancer.attributes.imageUrl}
                alt=''
              /> */}
                      {/* <span
                className={classNames(
                  person.status === 'online'
                    ? 'bg-green-400'
                    : 'bg-gray-300',
                  'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
                )}
                aria-hidden='true'
              /> */}
                    </span>
                    <div className='ml-4 truncate'>
                      <p className='text-sm font-medium text-gray-500 truncate'>
                        No freelancers available
                      </p>
                      <p className='text-sm text-gray-500 truncate'>
                        {/* {new Date(task.attributes.taskStart).toLocaleDateString(
                  undefined,
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )}{' '}
                -{' '}
                {new Date(task.attributes.taskFinish).toLocaleDateString(
                  undefined,
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )} */}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <Menu
            as='div'
            className='ml-2 flex-shrink-0 relative inline-block text-left'
          >
            <Menu.Button className='group relative w-8 h-8 bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              <span className='sr-only'>Open options menu</span>
              <span className='flex items-center justify-center h-full w-full rounded-full'>
                <DotsVerticalIcon
                  className='w-5 h-5 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='origin-top-right absolute z-10 top-0 right-9 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => setOpenSlideOver(true)}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer'
                        )}
                      >
                        Switch freelancer
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => handleFreelancerBreakLink()}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer'
                        )}
                      >
                        Remove from task
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu> */}
              </div>
            ) : (
              <>
                {data.freelancers.data.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className='relative rounded-lg border border-gray-300 bg-gray-50 group py-2 px-3 shadow-sm flex items-center space-x-4 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                  >
                    <Link
                      to={`/freelancers/${freelancer.id}`}
                      className='-m-1 flex-1 block p-1'
                    >
                      <div className='absolute inset-0' aria-hidden='true' />
                      <div className='flex-1 flex items-center min-w-0 relative'>
                        <span className='bg-gray-100 border rounded-full flex-shrink-0 inline-block relative'>
                          {freelancer.attributes.imageUrl ? (
                            <img
                              className='border h-12 w-12 rounded-full'
                              src={freelancer.attributes.imageUrl}
                              alt=''
                            />
                          ) : (
                            <UserIcon
                              className='text-gray-300 flex-shrink-0 h-12 w-12 p-1'
                              aria-hidden='true'
                            />
                          )}
                          <span
                            className={classNames(
                              freelancer.attributes.availableFrom <=
                                new Date().toISOString()
                                ? 'bg-green-400'
                                : 'bg-gray-300',
                              'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
                            )}
                            aria-hidden='true'
                          />
                        </span>
                        <div className='ml-4 truncate'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {freelancer.attributes.lastName},{' '}
                            {freelancer.attributes.firstName}
                          </p>
                          <p className='text-sm text-gray-500 truncate'>
                            {freelancer.attributes.competence}
                          </p>
                          <p className='text-sm text-gray-500 truncate'>
                            Available:{' '}
                            {new Date(
                              freelancer.attributes.availableFrom
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className='ml-2 flex-shrink-0 relative inline-block text-left'>
                      <div className='group relative w-12 h-12 bg-gray-50 inline-flex items-center justify-center'>
                        <span className='flex items-center justify-start h-full w-full rounded-full'>
                          € {freelancer.attributes.hourlyRate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </ul>
        </div>
        {/* End secondary column */}
      </main>
    </>
  );
}
