
#include <random>
#include <iostream>
#include <fstream>


using namespace std;

int main(int argc, char const *argv[])
{
	seed_seq seq{45, 1, 3};
	minstd_rand0 generator(seq);

	uniform_real_distribution distr(0.0, 1.0);
	cout << distr(generator) << endl;

	return 0;
}
