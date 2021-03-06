import { BenchmarkProperties, Test, Stats } from "./internal";

/**
 * The main class.
 * A Benchmark consists of a group of tests that are run and compared regarding the time performances.
 */
export class Benchmark {

    /**
     * This Benchmark properties
     */
    private properties: BenchmarkProperties = null;

    /**
     * The tests added by the user, to be run
     */
    private tests: Array<Test> = [];

    /**
     * The results obtained in the previous run of this benchmark.
     * Consists of a list of pairs test name - test stats
     */
    private results: Array<[string, Stats]> = [];

    /**
     * Function to run on the beginning of this benchmark
     */
    private onBegin: (benchmark: Benchmark) => void = (benchmark: Benchmark) => { };

    /**
     * Function to run on the end of the benchmark (on the end of all tests)
     */
    private onTestBegin: (benchmark: Benchmark, test: Test) => void = (benchmark: Benchmark, test: Test) => { };

    /**
     * Function to run on the end of the benchmark (on the end of all tests)
     */
    private onTestEnd: (benchmark: Benchmark, test: Test) => void = (benchmark: Benchmark, test: Test) => { };

    /**
     * Function to run on the end of the benchmark (on the end of all tests)
     */
    private onEnd: (benchmark: Benchmark) => void = (benchmark: Benchmark) => { };

    /**
     * Benchmark constructor
     * 
     * @param properties This Benchmark properties used to create a properties object
     */
    constructor(properties?: object) {
        this.properties = new BenchmarkProperties(properties);
    }

    /**
     * Get the @BenchmarkProperties used in this Benchmark, as an object 
     */
    getProperties(): BenchmarkProperties {
        return this.properties;
    }

    /**
     * Get the tests that perform on this Benchmark
     */
    getTests(): Array<Test> {
        return this.tests;
    }

    /**
     * Get the results previously obtained on this Benchmark
     * @return list of pairs test name - test stats
     */
    getResults(): Array<[string, Stats]> {
        return this.results;
    }

    /**
     * Add a new test to this Benchmark
     * 
     * @param testName the test name
     * @param fn The function to run on this test
     * @return the created @Test
     */
    add(test: Test): Benchmark {
        this.tests.push(test);
        return this;
    };

    /**
     * Add an event to this Benchmark. Possibilities:
     *  - 'onBegin'
     *  - 'onTestBegin'
     *  - 'onTestEnd'
     *  - 'onEnd'
     * 
     * @param eventName The name of the event to be altered
     * @param fn The function that will run when the event is called
     */
    on(eventName: string, fn): Benchmark {
        if (eventName.substr(0, 2) == "on" && this.hasOwnProperty(eventName))
            this[eventName] = fn;
        return this;
    }

    /**
     * Run this Benchmark list of @Test
     * 
     * @return results obtained as a list of pairs test name - test stats
     */
    run(): Array<[string, Stats]> {
        this.onBegin(this);

        for (let test of this.tests) {
            this.onTestBegin(this, test);

            test.run(this.getProperties());
            this.results.push([test.name, test.getStats()]);

            this.onTestEnd(this, test);
        }

        this.onEnd(this);

        return this.results;
    };
}