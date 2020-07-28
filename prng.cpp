
#include <random>
#include <iostream>
#include <fstream>
#include <string>
#include <sstream>


using namespace std;

int main(int argc, char const *argv[])
{
	minstd_rand0 generator = minstd_rand0();
	uniform_real_distribution<float> distr(0.0, 1.0);
	stringstream stream = stringstream();
	stream << "[\n";
	for (int i  = 0; i < 1000; i++){
		seed_seq seq = {45, i, 3};
		generator.seed(seq);
		stream << distr(generator) << ",\n";
	}
	ofstream fs = ofstream();
	fs.open("output.json");
	fs << stream.str() << "]" << endl;

	return 0;
}
